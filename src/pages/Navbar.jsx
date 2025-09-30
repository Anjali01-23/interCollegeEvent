import React from "react";
import { Calendar, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear login state (localStorage or session)
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");

    // Redirect to login page
    navigate("/");
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

        {/* Links */}
        <div className="flex gap-6 text-gray-600 font-medium">
          <Link to="/events" className="hover:text-purple-600">
            All Events
          </Link>
          <Link to="/admindashboard" className="hover:text-purple-600">
            Admin Panel
          </Link>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <UserCircle size={32} className="text-gray-600" />
          <div>
            <p className="text-sm font-semibold">
              {localStorage.getItem("userEmail") || "Guest"}
            </p>
            <p className="text-xs text-gray-500">College Admin</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-slate-600 text-white px-4 py-2 rounded-lg shadow 
             hover:bg-slate-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
