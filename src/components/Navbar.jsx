import React, { useState, useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user.role;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // used to detect outside clicks

  // ✅ Close dropdown when clicking anywhere
  useEffect(() => {
    const handleClick = (event) => {
      // if dropdown is open and click is outside it → close it
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    navigate("/"); // redirect to login
  };

  return (
    <nav className="flex justify-between items-center bg-white shadow px-8 py-4">
      {/* Left side */}
      <div className="flex items-center gap-10">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Calendar className="text-purple-600" size={28} />
          <span className="font-bold text-xl text-gray-800">
            CampusEventHub
          </span>
        </div>

        {/* Role-based links */}
        <div className="flex gap-6 text-gray-600 font-medium">
          {role === "Student" && (
            <>
              <Link to="/events">Student Dashboard</Link>
              <Link to="/myregistrations">My Registrations</Link>
            </>
          )}

          {role === "College Admin" && (
            <>
              <Link to="/dashboard">Admin Panel</Link>
              <Link to="/participant-dashboard">Participant Management Dashboard</Link>
            </>
          )}

          {role === "SuperAdmin" && (
            <Link to="/superadmindashboard">Super Admin Panel</Link>
          )}
        </div>
      </div>

      {/* Right Side - User Dropdown */}
      {user && (
        <div className="relative" ref={dropdownRef}>
          {/* User icon */}
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold"
          >
            {user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 z-10 border">
              <p className="px-4 py-2 text-gray-800 font-semibold border-b">
                {user.fullname || "Unknown User"}
              </p>
              <p className="px-4 py-2 text-gray-500 text-sm border-b">
                {user.email || "No email found"}
              </p>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
