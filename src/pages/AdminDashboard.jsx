import React, { useState } from "react";
import { Calendar, Users, ClipboardList, AlertTriangle } from "lucide-react";
import Navbar from "./Navbar";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button className="px-4 py-1 rounded-lg bg-gray-200 hover:bg-gray-300">
            Filter
          </button>
          <button className="px-4 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600">
            Security
          </button>
        </div>
      </header>

      {/* Stats Section */}
      <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <Calendar className="text-blue-500" />
          <div>
            <h3 className="text-lg font-bold">4</h3>
            <p className="text-sm text-gray-500">Total Events</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <Users className="text-green-500" />
          <div>
            <h3 className="text-lg font-bold">1,234</h3>
            <p className="text-sm text-gray-500">Active Users</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <ClipboardList className="text-purple-500" />
          <div>
            <h3 className="text-lg font-bold">0</h3>
            <p className="text-sm text-gray-500">Total Registrations</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <AlertTriangle className="text-orange-500" />
          <div>
            <h3 className="text-lg font-bold">0</h3>
            <p className="text-sm text-gray-500">Pending Reviews</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 border-b flex gap-8">
        {[
          "overview",
          "user-management",
          "event-management",
          "registrations",
          "admin-logs",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-purple-500 text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeTab === "overview" && (
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Events */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Events</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Inter-College Hackathon 2024",
                  organizer: "tech-university",
                  participants: 127,
                  tag: "hackathon",
                },
                {
                  title: "Cultural Fest - Harmony 2024",
                  organizer: "arts-college",
                  participants: 342,
                  tag: "cultural",
                },
                {
                  title: "Basketball Championship",
                  organizer: "sports-university",
                  participants: 160,
                  tag: "sports",
                },
                {
                  title: "Web Development Workshop",
                  organizer: "tech-university",
                  participants: 65,
                  tag: "workshop",
                },
              ].map((event, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b last:border-none pb-3"
                >
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {event.organizer} • {event.participants} participants
                    </p>
                  </div>
                  <span className="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-600">
                    {event.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">System Health</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Server Status</span>
                <span className="text-green-600 font-medium">Healthy</span>
              </li>
              <li className="flex justify-between">
                <span>Database</span>
                <span className="text-green-600 font-medium">Connected</span>
              </li>
              <li className="flex justify-between">
                <span>API Response</span>
                <span className="text-green-600 font-medium">152ms</span>
              </li>
              <li className="flex justify-between">
                <span>Uptime</span>
                <span className="text-green-600 font-medium">99.9%</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* User Management Section */}
      {activeTab === "user-management" && (
        <div className="px-8 py-6">
          <h2 className="text-lg font-semibold mb-4">User Management</h2>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">College</th>
                  <th className="px-4 py-2 text-left">Last Active</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Anjali",
                    role: "Student",
                    college: "Tech University",
                    lastActive: "2 hours ago",
                    status: "Active",
                  },
                  {
                    name: "Sarah",
                    role: "Organizer",
                    college: "Arts College",
                    lastActive: "1 day ago",
                    status: "Active",
                  },
                  {
                    name: "Sona",
                    role: "Admin",
                    college: "Engineering College",
                    lastActive: "3 days ago",
                    status: "Inactive",
                  },
                ].map((user, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "Student"
                            ? "bg-green-100 text-green-600"
                            : user.role === "Organizer"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-2">{user.college}</td>
                    <td className="px-4 py-2">{user.lastActive}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Event Management Section */}
      {activeTab === "event-management" && (
        <div className="px-8 py-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Event Management</h2>
            <div className="flex gap-4 text-sm">
              <button className="text-blue-600 hover:underline">
                Approve Pending
              </button>
              <button className="text-red-600 hover:underline">
                Flagged Events
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {[
              {
                title: "Inter-College Hackathon 2024",
                tags: ["tech", "hackathon"],
                participants: 127,
              },
              {
                title: "Cultural Fest - Harmony 2024",
                tags: ["cultural"],
                participants: 342,
              },
              {
                title: "Basketball Championship",
                tags: ["sports"],
                participants: 160,
              },
              {
                title: "Web Development Workshop",
                tags: ["workshop"],
                participants: 95,
              },
            ].map((event, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-500">
                    {event.participants} participants
                  </p>
                  <div className="flex gap-2 mt-2">
                    {event.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <button className="text-blue-600 hover:underline">View</button>
                  <button className="text-red-600 hover:underline">Actions</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
            {/* Registrations Section */}
      {activeTab === "registrations" && (
        <div className="px-8 py-6">
          <h2 className="text-lg font-semibold mb-4">Registrations</h2>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left">Event</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">College</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    event: "Inter-College Hackathon 2024",
                    user: "Riya Sharma",
                    college: "Tech University",
                    date: "29 Sep 2025",
                    status: "Confirmed",
                  },
                  {
                    event: "Cultural Fest - Harmony 2024",
                    user: "Aman Verma",
                    college: "Arts College",
                    date: "28 Sep 2025",
                    status: "Pending",
                  },
                ].map((reg, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{reg.event}</td>
                    <td className="px-4 py-2">{reg.user}</td>
                    <td className="px-4 py-2">{reg.college}</td>
                    <td className="px-4 py-2">{reg.date}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          reg.status === "Confirmed"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Logs Section */}
      {activeTab === "admin-logs" && (
        <div className="px-8 py-6">
          <h2 className="text-lg font-semibold mb-4">Admin Logs</h2>
          <div className="bg-white shadow rounded-lg p-4 space-y-3 text-sm">
            {[
              {
                action: "Approved new event: Basketball Championship",
                time: "2 hours ago",
              },
              {
                action: "Removed user: Rahul Singh",
                time: "5 hours ago",
              },
              {
                action: "Updated system settings",
                time: "1 day ago",
              },
            ].map((log, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b pb-2 last:border-0"
              >
                <p>{log.action}</p>
                <span className="text-gray-500">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
