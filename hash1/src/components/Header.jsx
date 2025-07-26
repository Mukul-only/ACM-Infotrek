// src/components/Header.jsx
// --- UPDATED WITH PROFESSIONAL DROPDOWN ---

import React, { useState, useEffect, useRef, useContext } from "react";
import Wrapper from "../util/Wrapper";
import Logo from "../assets/logo.svg?react";
import "./ButtonAnimation.css";
import MenuIcon from "../assets/menu.svg?react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiInfo,
  FiMail,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Your refs for the login/signup button animations
  const loginTextRef = useRef(null);
  const signupTextRef = useRef(null);
  const loginBtnRef = useRef(null);
  const signupBtnRef = useRef(null);

  // --- Logic to close dropdown when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Your existing button animation logic ---
  useEffect(() => {
    // ... your existing mousemove animation code ...
  }, [user]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  // Helper to get user initials for the avatar
  const getUserInitials = () => {
    if (!user || !user.username) return "U";
    return user.username
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const linkClasses =
    "duration-150 hover:font-bold hover:text-white text-gray-50 py-1 flex items-center gap-2";
  const btnClasses = "px-8 py-2 rounded-full font-medium cursor-follow-btn";

  // --- JSX for the Profile Dropdown ---
  const ProfileDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="flex items-center justify-center w-10 h-10 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-indigo-500"
      >
        {getUserInitials()}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 z-50 w-48 mt-2 origin-top-right border rounded-md shadow-lg bg-neutral-800 border-bdr">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-300 border-b border-bdr">
              Signed in as
              <br />
              <strong className="text-white">{user.username}</strong>
            </div>
            {/* You can link these to actual pages later */}

            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-3 px-4 py-2 text-sm text-left text-red-400 hover:bg-red-800/50 hover:text-red-300"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Wrapper className="relative flex items-center justify-between w-full pt-6 pb-4 sm:pt-8 sm:pb-6">
        <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
          <Logo className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
          <h1 className="ml-2 tracking-tighter text-white text-[4vw] sm:text-[3vw] md:text-3xl">
            INFOTREK'25
          </h1>
        </Link>
        <MenuIcon
          className="w-8 h-8 text-white cursor-pointer lg:hidden"
          onClick={toggleMobileMenu}
        />

        {/* Desktop Menu */}
        <div className="items-center hidden gap-6 text-white lg:flex">
          <Link to="/" className={linkClasses}>
            <FiHome /> HOME
          </Link>
          <Link to="/events" className={linkClasses}>
            <FiCalendar /> EVENTS
          </Link>
          <Link to="/team" className={linkClasses}>
            <FiUsers /> TEAM
          </Link>
          <Link to="/about" className={linkClasses}>
            <FiInfo /> ABOUT
          </Link>
          <Link to="/contact" className={linkClasses}>
            <FiMail /> CONTACT
          </Link>

          {user ? (
            <ProfileDropdown />
          ) : (
            <>
              {/* Login/Signup buttons for logged-out users */}
              <Link to="/login" className="block" ref={loginBtnRef}>
                <button
                  className={`${btnClasses} bg-white text-dark flex items-center justify-center gap-2`}
                >
                  <span
                    ref={loginTextRef}
                    className="relative z-10 flex items-center justify-center gap-2 text-container"
                  >
                    <p>LOGIN</p>
                    <FiLogIn className="relative z-10 w-4 h-4" />
                  </span>
                  <div className="btn-hover-area"></div>
                </button>
              </Link>
              <Link to="/signup" className="block" ref={signupBtnRef}>
                <button
                  className={`${btnClasses} border border-white text-white flex items-center justify-center gap-2`}
                >
                  <span
                    ref={signupTextRef}
                    className="relative z-10 flex items-center justify-center gap-2 text-container"
                  >
                    <p>SIGNUP</p>
                    <FiUserPlus className="relative z-10 w-4 h-4" />
                  </span>
                  <div className="btn-hover-area"></div>
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute z-50 flex flex-col items-stretch w-11/12 gap-3 px-6 py-6 text-lg transform -translate-x-1/2 border top-full lg:hidden left-1/2 bg-background border-bdr rounded-xl">
            <Link to="/" className={linkClasses} onClick={closeMobileMenu}>
              <FiHome /> HOME
            </Link>
            <div className="w-full h-[0.4px] bg-bdr" />
            <Link
              to="/events"
              className={linkClasses}
              onClick={closeMobileMenu}
            >
              <FiCalendar /> EVENTS
            </Link>
            <div className="w-full h-[0.4px] bg-bdr" />
            <Link to="/team" className={linkClasses} onClick={closeMobileMenu}>
              <FiUsers /> TEAM
            </Link>
            <div className="w-full h-[0.4px] bg-bdr" />
            <Link to="/about" className={linkClasses} onClick={closeMobileMenu}>
              <FiInfo /> ABOUT
            </Link>
            <div className="w-full h-[0.4px] bg-bdr" />
            <Link
              to="/contact"
              className={linkClasses}
              onClick={closeMobileMenu}
            >
              <FiMail /> CONTACT
            </Link>
            <div className="w-full h-[0.4px] bg-bdr" />

            {user ? (
              // Use the same ProfileDropdown logic but adapted for mobile context
              <div className="flex flex-col items-center mt-4">
                <ProfileDropdown />
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full mt-2"
                  onClick={closeMobileMenu}
                >
                  <button
                    className={`${btnClasses} bg-white text-dark w-full flex items-center justify-center gap-2`}
                  >
                    LOGIN
                    <FiLogIn />
                  </button>
                </Link>
                <Link
                  to="/signup"
                  className="w-full mt-1"
                  onClick={closeMobileMenu}
                >
                  <button
                    className={`${btnClasses} border border-white text-white w-full flex items-center justify-center gap-2`}
                  >
                    SIGNUP
                    <FiUserPlus />
                  </button>
                </Link>
              </>
            )}
          </div>
        )}
      </Wrapper>
    </>
  );
};

export default Header;
