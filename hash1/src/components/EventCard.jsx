// src/components/EventCard.jsx
// --- FINAL VERSION ---

import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Join from "../assets/join.svg?react";
import RegistrationModal from "./RegistrationModal";
import EventDetailsModal from "./EventDetailsModal";
import { AuthContext } from "../context/AuthContext"; // Import the context
import { FiCheckCircle } from "react-icons/fi"; // Import a new icon for the "Registered" state

const EventCard = ({ event }) => {
  // Get all the necessary state and functions from our AuthContext
  const { isAuthenticated, registeredEvents, removeRegisteredEvent, token } =
    useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUnregistering, setIsUnregistering] = useState(false); // Loading state for the unregister action

  // Check if the current user is registered for THIS event.
  // The 'registeredEvents' is a Set for fast lookups.
  const isRegistered = registeredEvents.has(event.id);

  const joinButtonRef = useRef(null);

  // Your creative button animation effect
  useEffect(() => {
    // Only apply the animation if the join button is actually rendered
    if (isAuthenticated && !isRegistered) {
      const button = joinButtonRef.current;
      if (!button) return;

      const handleMouseMove = (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        button.style.setProperty("--x", `${x}px`);
        button.style.setProperty("--y", `${y}px`);
      };
      button.addEventListener("mousemove", handleMouseMove);

      return () => {
        button.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isAuthenticated, isRegistered]); // Rerun effect if auth status changes

  // --- Modal Handlers ---
  const handleOpenDetailsModal = () => setIsDetailsModalOpen(true);
  const handleCloseDetailsModal = () => setIsDetailsModalOpen(false);
  const handleOpenModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  // --- Tooltip Handlers ---
  const handleMouseEnterCard = () => setShowTooltip(true);
  const handleMouseLeaveCard = () => setShowTooltip(false);
  const handleMouseMoveCard = (e) =>
    setTooltipPosition({ x: e.clientX + 15, y: e.clientY + 10 });

  // --- Unregister Logic ---
  const handleUnregister = async (e) => {
    e.stopPropagation(); // Prevent card click
    if (isUnregistering) return; // Prevent double clicks

    setIsUnregistering(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/event/unregister/${event.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to unregister.");
      }

      // On success, update the global state immediately
      removeRegisteredEvent(event.id);
    } catch (error) {
      console.error("Unregister Error:", error);
      alert(error.message); // Simple error feedback for the user
    } finally {
      setIsUnregistering(false);
    }
  };

  const details = [event.eventType, event.playerMode, event.subCategory]
    .filter(Boolean)
    .join(" • ");

  const paddingTopPercentage = (300 / 362) * 100;

  return (
    <>
      <div
        className="flex flex-col w-full max-w-[362px] rounded-2xl shadow-xl overflow-hidden bg-neutral-800 cursor-pointer hover:scale-[1.02] transition-transform duration-200 ease-out mx-auto relative"
        onClick={handleOpenDetailsModal}
        style={{ backgroundColor: "#18181b" }}
        onMouseEnter={handleMouseEnterCard}
        onMouseLeave={handleMouseLeaveCard}
        onMouseMove={handleMouseMoveCard}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ paddingTop: `${paddingTopPercentage}%` }}
        >
          <img
            src={event.image}
            alt={event.title}
            className="absolute top-0 left-0 object-cover w-full h-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/400x200?text=Event+Image";
              e.target.alt = "Placeholder Image";
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 p-4 sm:p-5"
            style={{
              background:
                "linear-gradient(to top, rgba(11, 11, 15, 0.95) 20%, rgba(11, 11, 15, 0.7) 60%, transparent 100%)",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-grow min-w-0">
                <h3 className="text-xl font-bold text-white sm:text-2xl mb-0.5 truncate">
                  {event.title}
                </h3>
                <p className="text-xs text-gray-300 truncate sm:text-sm">
                  {details}
                </p>
              </div>

              {/* --- DYNAMIC BUTTON LOGIC --- */}
              <div className="flex-shrink-0">
                {!isAuthenticated ? (
                  // State 1: User is NOT logged in
                  <Link
                    to="/login"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 text-xs font-semibold text-yellow-400 underline rounded-full sm:text-sm whitespace-nowrap hover:text-yellow-200"
                  >
                    Login to Join
                  </Link>
                ) : isRegistered ? (
                  // State 2: User IS logged in AND IS registered for this event
                  <button
                    onClick={handleUnregister}
                    disabled={isUnregistering}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-green-300 transition-colors duration-200 rounded-full bg-green-900/80 sm:px-4 sm:text-sm whitespace-nowrap hover:bg-red-800 hover:text-red-200 group disabled:bg-neutral-600 disabled:cursor-wait"
                  >
                    <span className="flex items-center gap-2 group-hover:hidden">
                      <FiCheckCircle /> Registered
                    </span>
                    <span className="items-center hidden gap-2 group-hover:flex">
                      Unregister?
                    </span>
                  </button>
                ) : (
                  // State 3: User IS logged in but is NOT registered for this event
                  <button
                    ref={joinButtonRef}
                    onClick={handleOpenModal}
                    onMouseEnter={(e) => e.stopPropagation()}
                    onMouseLeave={(e) => e.stopPropagation()}
                    className="flex-shrink-0 px-3 py-2 text-xs font-semibold rounded-full button-creative-effect sm:px-4 sm:text-sm whitespace-nowrap"
                  >
                    <span className="button-text-glow relative z-[1] flex items-center gap-1.5 sm:gap-2 transition-colors duration-300 ease-in-out">
                      <Join className="w-4 h-4 sm:w-5 sm:h-5" />
                      Join
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTooltip && (
        <div
          style={{
            position: "fixed",
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 1000,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          Click for event details
        </div>
      )}
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={event}
      />
      {isDetailsModalOpen && (
        <EventDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          event={event}
        />
      )}
    </>
  );
};

export default EventCard;
