import React, { useState, useEffect } from "react";
import {
  Calendar,
  BarChart2,
  Users,
  Activity,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getEvents, createEvent, updateEventStatus } from "../../api/api.js";

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
    college: "",
    status: "upcoming",
    image: null,
  });

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Form change handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit new event
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      await createEvent(data);
      alert("Event created successfully!");
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        startDate: "",
        endDate: "",
        college: "",
        status: "upcoming",
        image: null,
      });
      fetchEvents(); // Refresh events
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateEventStatus(id, status);
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const totalEvents = events.length;
  const activeEvents = events.filter((e) => e.status === "upcoming").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <header className="px-8 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Event Organizer Dashboard
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow 
                             hover:opacity-90 active:from-purple-700 active:to-blue-700 transition"
          >
            <Plus size={18} /> Create Event
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b text-gray-600 font-medium">
          {["overview", "my-events", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab === tab
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "hover:text-purple-600"
              }`}
            >
              {tab === "overview"
                ? "Overview"
                : tab === "my-events"
                ? "My Events"
                : "Analytics"}
            </button>
          ))}
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
                  <h2 className="text-xl font-bold">{totalEvents}</h2>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
                <Activity className="text-green-500" size={28} />
                <div>
                  <p className="text-gray-500 text-sm">Active Events</p>
                  <h2 className="text-xl font-bold">{activeEvents}</h2>
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
                {events.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent events available.</p>
                ) : (
                  events
                    .slice(0, 5)
                    .map((e) => (
                      <div
                        key={e.id}
                        className="flex justify-between items-center py-2 border-b last:border-b-0"
                      >
                        <span>{e.title}</span>
                        <button
                          className="text-purple-600 text-sm underline"
                          onClick={() =>
                            handleStatusUpdate(
                              e.id,
                              e.status === "upcoming" ? "completed" : "upcoming"
                            )
                          }
                        >
                          Mark {e.status === "upcoming" ? "Completed" : "Upcoming"}
                        </button>
                      </div>
                    ))
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                  Quick Actions
                </h3>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow 
                                     hover:opacity-90 active:from-purple-700 active:to-blue-700 transition"
                  >
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
            {events.length === 0 ? (
              <p className="text-gray-500 text-sm mt-2">
                You haven’t created any events yet.
              </p>
            ) : (
              events.map((e) => (
                <div key={e.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span>{e.title}</span>
                  <button
                    className="text-purple-600 text-sm underline"
                    onClick={() =>
                      handleStatusUpdate(
                        e.id,
                        e.status === "upcoming" ? "completed" : "upcoming"
                      )
                    }
                  >
                    Mark {e.status === "upcoming" ? "Completed" : "Upcoming"}
                  </button>
                </div>
              ))
            )}
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

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-3xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Create Event</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="college"
                placeholder="College Name"
                value={formData.college}
                onChange={handleChange}
                required
              />
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
              />
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>

              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg"
                >
                  Create Event
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
