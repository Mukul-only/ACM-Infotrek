// src/context/AuthContext.jsx
// --- ENHANCED VERSION ---

import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // Use a Set for fast lookups (e.g., registeredEvents.has(eventId))
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // This effect now also fetches user-specific data upon login/load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("authUser");

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          // If token exists, fetch their registrations
          await fetchUserRegistrations(storedToken);
        }
      } catch (error) {
        console.error("Failed to initialize auth state", error);
        logout(); // Clear corrupted state
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const fetchUserRegistrations = async (authToken) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/event/my-registrations`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (!response.ok) throw new Error("Could not fetch registrations");
      const eventIds = await response.json();
      setRegisteredEvents(new Set(eventIds));
    } catch (error) {
      console.error(error);
      // Don't log the user out, just fail gracefully
      setRegisteredEvents(new Set());
    }
  };

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
    // After logging in, fetch their registrations
    fetchUserRegistrations(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRegisteredEvents(new Set()); // Clear registrations on logout
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  // New functions to update the set without a full refetch
  const addRegisteredEvent = (eventId) => {
    setRegisteredEvents((prevSet) => new Set(prevSet).add(eventId));
  };

  const removeRegisteredEvent = (eventId) => {
    setRegisteredEvents((prevSet) => {
      const newSet = new Set(prevSet);
      newSet.delete(eventId);
      return newSet;
    });
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
    registeredEvents, // Expose the set of event IDs
    addRegisteredEvent, // Expose the update functions
    removeRegisteredEvent,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
