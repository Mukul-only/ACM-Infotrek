// src/components/EventDetailsModal.jsx
import React, { useEffect, useState } from "react";
import { getEventRichDetailsById } from "../data/eventRichDetails"; // Import the getter
import DetailsIcon from "../assets/view-details.svg?react";
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

const EventDetailsModal = ({ isOpen, onClose, event: basicEventData }) => {
  // basicEventData comes from eventsData.js (passed from EventCard)
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (isOpen && basicEventData) {
      const richDetails = getEventRichDetailsById(basicEventData.id);
      setDetails(richDetails); // This will be the rich object, or undefined if not found
    } else {
      setDetails(null); // Reset when modal is closed or no basic data
    }
  }, [isOpen, basicEventData]);

  if (!isOpen || !basicEventData) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Determine what to display: rich details if available, otherwise basic info
  const displayTitle = details?.title || basicEventData.title;
  const displayImage = details?.detailsImage || basicEventData.image; // Use rich detail image, fallback to card image
  const displayIntroduction =
    details?.introduction || basicEventData.description; // Use rich intro, fallback to card description

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div
      className="fixed inset-0 z-[7000] bg-black/75 flex items-center justify-center p-2 sm:p-4 transition-opacity duration-300 ease-in-out"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-background border-2 border-bdr text-txt rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between flex-shrink-0 p-4 border-b border-bdr">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <DetailsIcon className="w-6 h-6" />
            Event Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 transition-colors border rounded-full cursor-pointer text-neutral-400 hover:text-white hover:bg-neutral-700 border-bdr"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow p-4 space-y-5 overflow-y-auto text-sm sm:p-6 sm:space-y-6 sm:text-base">
          {/* Top Section: Image and Title/Tagline */}
          <div className="flex flex-col items-start gap-4 mb-4 md:flex-row md:gap-6 md:mb-6">
            <div className="w-full md:w-[260px] lg:w-[300px] flex-shrink-0">
              <img
                src={displayImage}
                alt={`${displayTitle} details`}
                className="object-contain w-full h-auto aspect-w-4 aspect-h-3"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=Image+Error";
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-xl font-bold text-white sm:text-2xl md:text-3xl sm:mb-2">
                {displayTitle}
              </h3>
              {details?.tagline && (
                <p className="block mt-1 mb-2 text-base font-normal sm:text-lg text-txt">
                  {details.tagline}
                </p>
              )}
              {/* Display basic info if no rich details or to supplement */}
              {!details && ( // Show basic info only if no rich details, or always if preferred
                <div className="mt-2 space-y-1 text-xs text-neutral-400 sm:text-sm">
                  {basicEventData.eventType && (
                    <p>
                      <strong>Type:</strong>{" "}
                      {capitalizeFirstLetter(basicEventData.eventType)}
                    </p>
                  )}
                  {basicEventData.playerMode && (
                    <p>
                      <strong>Mode:</strong>{" "}
                      {capitalizeFirstLetter(basicEventData.playerMode)}
                    </p>
                  )}
                  {basicEventData.subCategory && (
                    <p>
                      <strong>Category:</strong>{" "}
                      {capitalizeFirstLetter(basicEventData.subCategory)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Introduction/Description */}
          {displayIntroduction && (
            <section>
              <h4 className="mb-2 text-lg font-semibold text-white sm:text-xl">
                {details ? `What is ${displayTitle}?` : `About ${displayTitle}`}
              </h4>
              <p className="leading-relaxed whitespace-pre-line text-neutral-300">
                {displayIntroduction}
              </p>
            </section>
          )}

          {/* --- Sections for Rich Details (only if 'details' object exists) --- */}
          {details && (
            <>
              {details.durationDetails && (
                <section>
                  <h4 className="mb-2 text-lg font-semibold text-white sm:text-xl">
                    Event Timeline
                  </h4>
                  <ul className="space-y-1 list-none text-neutral-300">
                    {details.durationDetails.date && (
                      <li>Date: {details.durationDetails.date}</li>
                    )}
                    {details.durationDetails.time && (
                      <li>Time: {details.durationDetails.time}</li>
                    )}
                    {details.durationDetails.duration && (
                      <li>Duration: {details.durationDetails.duration}</li>
                    )}
                    {details.durationDetails.platform && (
                      <li>Platform: {details.durationDetails.platform}</li>
                    )}
                  </ul>
                </section>
              )}

              {details.formatAndRules?.length > 0 && (
                <section>
                  <h4 className="mb-2 text-lg font-semibold text-white sm:text-xl">
                    Format & Rules
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-neutral-300 pl-1">
                    {details.formatAndRules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </section>
              )}

              {details.judgingCriteria?.length > 0 && (
                <section>
                  <h4 className="mb-2 text-lg font-semibold text-white sm:text-xl">
                    Judging Criteria
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-neutral-300 pl-1">
                    {details.judgingCriteria.map((criterion, index) => (
                      <li key={index}>{criterion}</li>
                    ))}
                  </ul>
                </section>
              )}

              {details.whoCanParticipate?.length > 0 && (
                <section>
                  <h4 className="mb-2 text-lg font-semibold text-white sm:text-xl">
                    Who Can Participate?
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-neutral-300 pl-1">
                    {details.whoCanParticipate.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {details.prizesAndPerks?.length > 0 && (
                <section>
                  <h4 className="mb-2 text-lg font-semibold text-white sm:text-xl">
                    Prizes & Perks
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-neutral-300 pl-1">
                    {details.prizesAndPerks.map((perk, index) => (
                      <li key={index}>{perk}</li>
                    ))}
                  </ul>
                </section>
              )}

              {details.whyRegister?.length > 0 && (
                <section>
                  <h4 className="mb-2 text-lg font-semibold text-white sm:text-xl">
                    Why You Should Register
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-neutral-300 pl-1">
                    {details.whyRegister.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </section>
              )}

              {details.concludingTagline && (
                <p className="pt-4 mt-4 font-semibold text-center text-white border-t border-neutral-700">
                  {details.concludingTagline.replace(
                    /\[Event Name\]/gi,
                    displayTitle
                  )}
                </p>
              )}
            </>
          )}
          {/* --- End Sections for Rich Details --- */}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
