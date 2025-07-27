// // src/App.jsx
// import React, { useState, useEffect } from "react";
// import { Routes, Route, Link } from "react-router-dom";
// import "./App.css";
// import HomePage from "./pages/HomePage";
// import EventsPage from "./pages/EventsPage";
// import TeamPage from "./pages/TeamPage";
// import AboutPage from "./pages/AboutPage";
// import ContactPage from "./pages/ContactPage";
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";
// import SvgLoading from "./util/SvgLoading";

// const NotFoundPage = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-900">
//     <h1 className="mb-4 text-6xl font-bold">404</h1>
//     <p className="mb-8 text-2xl">Page Not Found</p>
//     <Link
//       to="/"
//       className="px-6 py-3 font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700"
//     >
//       Go Home
//     </Link>
//   </div>
// );

// function App() {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 6000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       {isLoading ? (
//         <SvgLoading />
//       ) : (
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/events" element={<EventsPage />} />
//           <Route path="/team" element={<TeamPage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/contact" element={<ContactPage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/signup" element={<SignupPage />} />
//           <Route path="*" element={<NotFoundPage />} />
//         </Routes>
//       )}
//     </>
//   );
// }

// export default App;

// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css"; // Keep for global styles and Tailwind import

// Import Page Components
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import TeamPage from "./pages/TeamPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SvgLoading from "./util/SvgLoading";

// Optional: Placeholder for a 404 page
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-900">
    <h1 className="mb-4 text-6xl font-bold">404</h1>
    <p className="mb-8 text-2xl">Page Not Found</p>
    <Link
      to="/"
      className="px-6 py-3 font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700"
    >
      Go Home
    </Link>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [fadeOutLoading, setFadeOutLoading] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setFadeOutLoading(true);
    }, 5500);

    const hideLoadingTimer = setTimeout(() => {
      setIsLoading(false);

      setTimeout(() => {
        setShowContent(true);
      }, 150);
    }, 6000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideLoadingTimer);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div
          className={`fixed inset-0 z-[9999] transition-opacity duration-400 ease-out ${
            fadeOutLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          <SvgLoading />
        </div>
      )}

      {!isLoading && (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </>
  );
}

export default App;
