import React, { useState, useEffect, useRef } from "react";
import { Calendar, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // rehydrate user safely
  let parsedUser = null;
  try {
    parsedUser = JSON.parse(localStorage.getItem("user")) || null;
  } catch (e) {
    parsedUser = null;
  }
  const [user, setUser] = useState(parsedUser);
  const role = (user && user.role) || "";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // close mobile menu when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // keep user state in sync if localStorage changed elsewhere
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") {
        try {
          setUser(JSON.parse(e.newValue));
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    setUser(null);
    navigate("/"); // redirect to home/login
  };

  // Build role-based links (keeps your existing labels)
  const RoleLinks = () => {
    if ((role || "").toLowerCase() === "student") {
      return (
        <>
          <Link to="/events" className="block md:inline-block">Student Dashboard</Link>
          <Link to="/myregistrations" className="block md:inline-block">My Registrations</Link>
        </>
      );
    }
    if ((role || "").toLowerCase() === "college admin" || (role || "").toLowerCase() === "collegeadmin") {
      return (
        <>
          <Link to="/dashboard" className="block md:inline-block">Admin Panel</Link>
          <Link to="/participant-dashboard" className="block md:inline-block">Participant Management</Link>
        </>
      );
    }
    if ((role || "").toLowerCase() === "superadmin" || (role || "").toLowerCase() === "super admin") {
      return <Link to="/superadmindashboard" className="block md:inline-block">Super Admin Panel</Link>;
    }
    return null;
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Calendar className="text-purple-600" size={28} />
              <span className="font-bold text-lg text-gray-800 hidden sm:inline">CampusEventHub</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
            <RoleLinks />
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Desktop user area */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">{user.fullname || user.name || user.email}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>

                {/* dropdown trigger */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((p) => !p)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold"
                    aria-expanded={dropdownOpen}
                  >
                    {user.fullname ? user.fullname.charAt(0).toUpperCase() : (user.name ? user.name.charAt(0).toUpperCase() : "U")}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 z-10 border">
                      <p className="px-4 py-2 text-gray-800 font-semibold border-b">
                        {user.fullname || user.name || "Unknown User"}
                      </p>
                      <p className="px-4 py-2 text-gray-500 text-sm border-b">{user.email || "No email found"}</p>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-gray-700 hover:text-purple-600">Sign in</Link>
                <Link to="/signup" className="px-3 py-1 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white">Sign up</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen((p) => !p)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      <div className={`md:hidden border-t bg-white ${mobileOpen ? "block" : "hidden"}`}>
        <div className="px-4 py-3 space-y-2">
          {/* Role links (stacked) */}
          <div className="flex flex-col gap-2 text-gray-700">
            <RoleLinks />
          </div>

          <div className="pt-3 border-t">
            {user ? (
              <>
                <div className="py-2">
                  <div className="text-sm font-medium text-gray-800">{user.fullname || user.name || user.email}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-sm bg-gray-100 hover:bg-gray-200 flex items-center gap-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-purple-600">Sign in</Link>
                <Link to="/signup" className="block px-3 py-2 rounded-md text-base bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
