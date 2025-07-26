// src/components/RegistrationModal.jsx
// --- MODIFIED WITH REAL REGISTRATION LOGIC ---

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // 1. Import the AuthContext

// (The CloseIcon component remains the same)
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const participationStatements = [
  "I am willing to participate in this event.",
  "I understand that my participation is voluntary.",
  "I will adhere to the event's code of conduct and guidelines.",
  "I acknowledge that the event organizers may capture photos or videos during the event for promotional purposes.",
  "I confirm that the information I provide for registration is accurate.",
];

const RegistrationModal = ({ isOpen, onClose, event }) => {
  const { token, user, addRegisteredEvent } = useContext(AuthContext); // 2. Get user and token from context

  // Form state
  const [hasAgreedToStatements, setHasAgreedToStatements] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState(""); // This will now be for emails

  // API call state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isTeamEvent = event?.playerMode === "team based";

  // Effect to reset the form and messages when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setHasAgreedToStatements(false);
      setTeamName("");
      setTeamMembers(user ? user.email + ", " : ""); // Pre-fill with logged-in user's email
      setError("");
      setSuccessMessage("");
      setIsLoading(false);
    }
  }, [isOpen, event, user]);

  if (!isOpen || !event) {
    return null;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // 3. Check for authentication token
    if (!token) {
      setError("You must be logged in to register for an event.");
      return;
    }

    setIsLoading(true);

    // 4. Construct the payload to match the backend API
    const payload = {
      eventId: event.id, // Assumes your event object has a MongoDB _id
      type: isTeamEvent ? "group" : "individual", // Translate boolean to string
    };

    if (isTeamEvent) {
      const memberEmails = teamMembers
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean);
      if (!teamName.trim() || memberEmails.length === 0) {
        setError(
          "For a team event, a team name and at least one member's email are required."
        );
        setIsLoading(false);
        return;
      }
      payload.groupName = teamName.trim();
      payload.members = memberEmails;
    }

    try {
      // 5. Make the API call with Authorization header
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/event/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the auth token
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! Status: ${response.status}`
        );
      }
      addRegisteredEvent(payload.eventId);
      setSuccessMessage(data.message || "Registration successful!");
      // Optionally, close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[6000] bg-black/60 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-neutral-800 border border-neutral-700 shadow-2xl rounded-xl w-full max-w-md flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between flex-shrink-0 p-5 border-b border-neutral-700">
          <h2 className="text-xl font-semibold text-white">
            Register for Event
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 rounded-full hover:text-white hover:bg-neutral-700"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* 6. Add area for success/error messages */}
        {successMessage && (
          <div className="p-4 text-center text-green-400 bg-green-900/50">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="p-4 text-center text-red-400 bg-red-900/50">
            {error}
          </div>
        )}

        {!successMessage && ( // Hide form on success
          <form
            id="registrationForm"
            onSubmit={handleRegister}
            className="flex-grow p-5 space-y-6 overflow-y-auto"
          >
            <div>
              <p className="mb-1 text-sm text-gray-300">
                You are registering for:
              </p>
              <p className="p-3 text-lg font-medium text-white rounded-md bg-neutral-700">
                {event.title} ({event.playerMode})
              </p>
            </div>

            {isTeamEvent && (
              <>
                <div>
                  <label
                    htmlFor="teamName"
                    className="block mb-1.5 text-sm font-medium text-gray-200"
                  >
                    Team Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-white placeholder-gray-400 border rounded-md bg-neutral-700 border-neutral-600 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your team's name"
                  />
                </div>
                <div>
                  {/* 7. Updated label and placeholder to ask for EMAILS */}
                  <label
                    htmlFor="teamMembers"
                    className="block mb-1.5 text-sm font-medium text-gray-200"
                  >
                    Team Members' Emails <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="teamMembers"
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-white placeholder-gray-400 border rounded-md bg-neutral-700 border-neutral-600 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="your.email@example.com, member2@example.com"
                  />
                  <p className="mt-1.5 text-xs text-gray-400">
                    Enter emails separated by commas. Please include your own
                    email.
                  </p>
                </div>
              </>
            )}

            <div>
              <p className="mb-2 text-sm font-medium text-gray-200">
                Please review and agree:
              </p>
              <ul className="pl-1 space-y-1.5 list-disc list-inside text-sm text-gray-300 max-h-48 overflow-y-auto bg-neutral-700/30 p-3 rounded-md border border-neutral-600/50">
                {participationStatements.map((statement, index) => (
                  <li key={index}>{statement}</li>
                ))}
              </ul>
            </div>

            <div>
              <label
                htmlFor="agreeStatements"
                className="flex items-center p-2 -m-2 rounded-md cursor-pointer hover:bg-neutral-700/50"
              >
                <input
                  type="checkbox"
                  id="agreeStatements"
                  checked={hasAgreedToStatements}
                  onChange={(e) => setHasAgreedToStatements(e.target.checked)}
                  className="w-5 h-5 text-indigo-500 rounded cursor-pointer form-checkbox bg-neutral-700 border-neutral-600 focus:ring-indigo-500"
                />
                <span className="ml-3 text-sm text-gray-200">
                  I agree to all the above statements.
                </span>
              </label>
            </div>
          </form>
        )}

        {!successMessage && ( // Hide footer on success
          <div className="flex-shrink-0 p-5 border-t border-neutral-700">
            <button
              type="submit"
              form="registrationForm"
              disabled={
                isLoading ||
                !hasAgreedToStatements ||
                (isTeamEvent && (!teamName.trim() || !teamMembers.trim()))
              }
              className="w-full px-4 py-3 text-base font-semibold text-white transition-colors duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isLoading ? "Registering..." : "Register for this event"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationModal;
