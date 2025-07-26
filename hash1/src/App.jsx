// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css"; // Keep for global styles and Tailwind import

// Import Page Components
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import TeamPage from "./pages/TeamPage"; // New
import AboutPage from "./pages/AboutPage"; // New
import ContactPage from "./pages/ContactPage"; // New
import LoginPage from "./pages/LoginPage"; // New
import SignupPage from "./pages/SignupPage"; // New

// Optional: Placeholder for a 404 page
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-900">
    {/* You might want to include your Header here too, or a simplified one */}
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
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} /> {/* Catch-all for 404 */}
      </Routes>
    </>
  );
}

export default App;
