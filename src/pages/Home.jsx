// src/pages/Home.jsx
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">CampusEventHub</h1>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="mt-1 sm:mt-0 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            Manage & Explore{" "}
            <span className="text-indigo-600">College Events</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            A platform where students and admins can collaborate to host, manage,
            and register for campus events easily.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/signup"
              className="w-full sm:w-auto text-center px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg hover:bg-indigo-700 shadow-md"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto text-center px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg text-lg hover:bg-indigo-50 shadow-md"
            >
              Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-gray-500 text-sm">
        © 2025 CampusEventHub. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Home;
