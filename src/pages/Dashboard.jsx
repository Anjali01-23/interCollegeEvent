import React, { useState } from "react";
import {
  Calendar,
  BarChart2,
  Users,
  Activity,
  Plus,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // Track which tab is active
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
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
            <button
              onClick={() => navigate("/events")}
              className="hover:text-purple-600"
            >
              All Events
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-purple-600 border-b-2 border-purple-600"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <UserCircle size={32} className="text-gray-600" />
          <div>
            <p className="text-sm font-semibold">Sarah Wilson</p>
            <p className="text-xs text-gray-500">College Admin</p>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="px-8 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Event Organizer Dashboard
          </h1>
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow 
                             hover:opacity-90 active:from-purple-700 active:to-blue-700 transition">
            <Plus size={18} /> Create Event
          </button>
        </div>

        {/* Sub Navbar (Tabs) */}
        <div className="flex gap-8 border-b text-gray-600 font-medium">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2 ${
              activeTab === "overview"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "hover:text-purple-600"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("my-events")}
            className={`pb-2 ${
              activeTab === "my-events"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "hover:text-purple-600"
            }`}
          >
            My Events
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`pb-2 ${
              activeTab === "analytics"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "hover:text-purple-600"
            }`}
          >
            Analytics
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-6">
        {activeTab === "overview" && (
          <>
            {/* Stats Cards */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
                <Calendar className="text-blue-500" size={28} />
                <div>
                  <p className="text-gray-500 text-sm">Total Events</p>
                  <h2 className="text-xl font-bold">0</h2>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
                <Activity className="text-green-500" size={28} />
                <div>
                  <p className="text-gray-500 text-sm">Active Events</p>
                  <h2 className="text-xl font-bold">0</h2>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
                <Users className="text-purple-500" size={28} />
                <div>
                  <p className="text-gray-500 text-sm">Total Registrations</p>
                  <h2 className="text-xl font-bold">0</h2>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
                <BarChart2 className="text-orange-500" size={28} />
                <div>
                  <p className="text-gray-500 text-sm">Average Participants</p>
                  <h2 className="text-xl font-bold">0</h2>
                </div>
              </div>
            </section>

            {/* Bottom Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Events */}
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                  Recent Events
                </h3>
                <p className="text-gray-500 text-sm">
                  No recent events available.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                  Quick Actions
                </h3>
                <div className="flex flex-col gap-3">
                  <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow 
                                     hover:opacity-90 active:from-purple-700 active:to-blue-700 transition">
                    <Plus size={18} /> Create New Event
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300">
                    View All Registrations
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300">
                    Export Event Data
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "my-events" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold">My Events</h2>
            <p className="text-gray-500 text-sm mt-2">
              You haven’t created any events yet.
            </p>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Analytics</h2>
            <p className="text-gray-500 text-sm mt-2">
              Analytics data will appear here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
