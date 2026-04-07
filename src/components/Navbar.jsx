// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Calendar, Menu, X, Sun, Moon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- THEME: read stored value or system preference (returns boolean) ---
  const [isDark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark") return true;
      if (stored === "light") return false;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  // Keep <html> class in sync and persist to localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

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

  // Build role-based links (unchanged)
  const RoleLinks = () => {
    if ((role || "").toLowerCase() === "student") {
      return (
        <>
          <Link to="/events" className="block md:inline-block px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800/60">
            Student Dashboard
          </Link>
          <Link to="/myregistrations" className="block md:inline-block px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800/60">
            My Registrations
          </Link>
        </>
      );
    }
    if ((role || "").toLowerCase() === "college admin" || (role || "").toLowerCase() === "collegeadmin") {
      return (
        <>
          <Link to="/dashboard" className="block md:inline-block px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800/60">
            Admin Panel
          </Link>
          <Link to="/participant-dashboard" className="block md:inline-block px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800/60">
            Participant Management Dashboard
          </Link>
        </>
      );
    }
    if ((role || "").toLowerCase() === "superadmin" || (role || "").toLowerCase() === "super admin") {
      return (
        <>
          <Link to="/superadmindashboard" className="block md:inline-block px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800/60">
            Super Admin Panel
          </Link>
          <Link to="/adminparticipantdashboard" className="block md:inline-block px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800/60">
            Admin Requests
          </Link>
        </>
      );
    }
    return null;
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Calendar className="text-purple-600 dark:text-purple-400" size={28} />
              <span className="font-bold text-lg text-gray-900 dark:text-gray-100 hidden sm:inline">CampusEventHub</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-gray-700 dark:text-gray-300 font-medium">
            <RoleLinks />
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle button (keeps your click logic) */}
            <button
              onClick={() => setDark((p) => !p)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-500" />}
            </button>

            {/* Desktop user area */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.fullname || user.name || user.email}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user.role}</div>
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
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-10 border border-gray-200 dark:border-gray-700">
                      <p className="px-4 py-2 text-gray-900 dark:text-gray-100 font-semibold border-b border-gray-200 dark:border-gray-700">
                        {user.fullname || user.name || "Unknown User"}
                      </p>
                      <p className="px-4 py-2 text-gray-600 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-gray-700">{user.email || "No email found"}</p>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-gray-900 dark:text-gray-100 hover:underline">Sign in</Link>
                <Link to="/signup" className="px-3 py-1 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Sign up</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen((p) => !p)}
                className="p-2 rounded-md text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
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
      <div className={`md:hidden border-t border-gray-200 dark:border-gray-800 ${mobileOpen ? "block" : "hidden"} bg-white dark:bg-gray-900`}>
        <div className="px-4 py-3 space-y-2">
          <div className="flex flex-col gap-2 text-gray-900 dark:text-gray-100">
            <RoleLinks />
          </div>

          <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
            {user ? (
              <>
                <div className="py-2">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.fullname || user.name || user.email}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user.role}</div>
                </div>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-sm bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 hover:opacity-90">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base text-gray-900 dark:text-gray-100">Sign in</Link>
                <Link to="/signup" className="block px-3 py-2 rounded-md text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
