// // src/pages/EventsPage.jsx
// import React, { useState, useMemo, useEffect } from "react";
// import Header from "../components/Header";
// import Wrapper from "../util/Wrapper";
// import EventCard from "../components/EventCard";
// import { events as allEventsData } from "../data/eventsData";
// import All from "../assets/all.svg?react";
// import Ball from "../assets/ball.svg?react";
// import Laptop from "../assets/laptop.svg?react";

// const EventsPage = () => {
//   const [activeFilter, setActiveFilter] = useState("all");

//   useEffect(() => {
//     if (!document.body.classList.contains("cosmic-body-active")) {
//       document.body.style.backgroundColor = "#111827";
//       document.body.style.overflow = "auto";
//     }
//     return () => {};
//   }, []);

//   const filteredEvents = useMemo(() => {
//     if (activeFilter === "all") {
//       return allEventsData;
//     }
//     return allEventsData.filter((event) => event.eventType === activeFilter);
//   }, [activeFilter]);

//   const FilterButton = ({
//     filterType,
//     label,
//     icon,
//     currentFilter,
//     setFilter,
//   }) => (
//     <button
//       onClick={() => setFilter(filterType)}
//       className={`px-4 py-2 sm:px-8 sm:py-2 rounded-full gap-2 text-xs sm:text-base font-medium flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer border border-bdr
//         ${
//           currentFilter === filterType
//             ? "bg-white text-gray-900 shadow-md"
//             : "text-txt hover:bg-neutral-700 hover:text-white"
//         }`}
//     >
//       {icon}
//       {label}
//     </button>
//   );

//   return (
//     <div className="relative">
//       <div className="absolute inset-0 min-h-screen overflow-y-auto text-white bg-black/30">
//         <Header />
//         <Wrapper>
//           <div className="py-12 md:py-16">
//             <div className="mb-8 text-center md:mb-12">
//               <h1 className="mb-3 text-4xl font-bold sm:text-5xl">EVENTS</h1>
//               <p className="max-w-2xl mx-auto text-sm leading-snug text-txt sm:text-base">
//                 Welcome to INFOTRECK'2025, presented by the ACM Club. Browse
//                 through a range of technical and non-technical events and
//                 register to be part of the excitement. Pick your interests, join
//                 the action, and showcase your skills!
//               </p>
//             </div>

//             <div className="flex flex-wrap justify-start gap-2 mb-2 ">
//               <div>
//                 <FilterButton
//                   filterType="all"
//                   label="All"
//                   icon={<All className="w-4 h-4 sm:w-6 sm:h-6" />}
//                   currentFilter={activeFilter}
//                   setFilter={setActiveFilter}
//                 />
//               </div>
//               <div>
//                 <FilterButton
//                   filterType="technical"
//                   label="Technical"
//                   icon={<Laptop className="w-4 h-4 sm:w-6 sm:h-6" />}
//                   currentFilter={activeFilter}
//                   setFilter={setActiveFilter}
//                 />
//               </div>
//               <div>
//                 <FilterButton
//                   filterType="non-tech"
//                   label="Non-Tech"
//                   icon={<Ball className="w-4 h-4 sm:w-6 sm:h-6" />}
//                   currentFilter={activeFilter}
//                   setFilter={setActiveFilter}
//                 />
//               </div>
//             </div>

//             <p className="mb-8 text-xs text-txt sm:text-sm md:mb-10">
//               (click on the events for details)
//             </p>

//             <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
//               {filteredEvents.length > 0 ? (
//                 filteredEvents.map((event) => (
//                   <div key={event.id}>
//                     <EventCard event={event} />
//                   </div>
//                 ))
//               ) : (
//                 <p className="py-8 text-center text-gray-400 col-span-full">
//                   No events found for this filter.
//                 </p>
//               )}
//             </div>
//           </div>
//         </Wrapper>
//       </div>
//     </div>
//   );
// };

// export default EventsPage;

// src/pages/EventsPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import Header from "../components/Header";
import Wrapper from "../util/Wrapper";
import EventCard from "../components/EventCard";
import { events as allEventsData } from "../data/eventsData";
import All from "../assets/all.svg?react";
import Ball from "../assets/ball.svg?react";
import Laptop from "../assets/laptop.svg?react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const EventsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (!document.body.classList.contains("cosmic-body-active")) {
      document.body.style.backgroundColor = "#111827";
      document.body.style.overflow = "auto";
    }
    return () => {};
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return allEventsData;
    return allEventsData.filter((event) => event.eventType === activeFilter);
  }, [activeFilter]);

  const FilterButton = ({
    filterType,
    label,
    icon,
    currentFilter,
    setFilter,
  }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setFilter(filterType)}
      className={`px-4 py-2 sm:px-8 sm:py-2 rounded-full gap-2 text-xs sm:text-base font-medium flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer border border-bdr
        ${
          currentFilter === filterType
            ? "bg-white text-gray-900 shadow-md"
            : "text-txt hover:bg-neutral-700 hover:text-white"
        }`}
    >
      {icon}
      {label}
    </motion.button>
  );

  return (
    <div className="relative">
      <div className="absolute inset-0 min-h-screen overflow-y-auto text-white bg-black/30">
        <Header />
        <Wrapper>
          <motion.div
            className="py-12 md:py-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="mb-8 text-center md:mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="mb-3 text-4xl font-bold sm:text-5xl">EVENTS</h1>
              <p className="max-w-2xl mx-auto text-sm leading-snug text-txt sm:text-base">
                Welcome to INFOTREK'25, presented by the ACM Club. Browse
                through a range of technical and non-technical events and
                register to be part of the excitement. Pick your interests, join
                the action, and showcase your skills!
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-start gap-2 mb-2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FilterButton
                filterType="all"
                label="All"
                icon={<All className="w-4 h-4 sm:w-6 sm:h-6" />}
                currentFilter={activeFilter}
                setFilter={setActiveFilter}
              />
              <FilterButton
                filterType="technical"
                label="Technical"
                icon={<Laptop className="w-4 h-4 sm:w-6 sm:h-6" />}
                currentFilter={activeFilter}
                setFilter={setActiveFilter}
              />
              <FilterButton
                filterType="non-tech"
                label="Non-Tech"
                icon={<Ball className="w-4 h-4 sm:w-6 sm:h-6" />}
                currentFilter={activeFilter}
                setFilter={setActiveFilter}
              />
            </motion.div>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="mb-8 text-xs text-txt sm:text-sm md:mb-10"
            >
              (click on the events for details)
            </motion.p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id} // <-- Make sure this key is unique (event.id is perfect)
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))
              ) : (
                <p className="py-8 text-center text-gray-400 col-span-full">
                  No events found for this filter.
                </p>
              )}
            </div>
          </motion.div>
        </Wrapper>
      </div>
    </div>
  );
};

export default EventsPage;
