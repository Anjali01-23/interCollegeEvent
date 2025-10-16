import React, { useState, useEffect } from "react";
import { deleteEvent } from "../../api/api";
import { Trash2 } from "lucide-react"; // for trash icon
import { Edit } from "lucide-react"; // at top of file
import { updateEvent } from "../../api/api";
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
import { getRegistrations } from "../../api/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const[requests,setRequests]=useState([]);

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

    if (editingEventId) {
      // UPDATE existing event
      await updateEvent(editingEventId, data); // make this API call
      alert("Event updated successfully!");
    } else {
      // CREATE new event
      await createEvent(data);
      alert("Event created successfully!");
    }

    setShowCreateModal(false);
    setEditingEventId(null);
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
    fetchEvents();
  } catch (err) {
    console.error(err);
    alert("Failed to submit event. Please try again.");
  }
};

      

  const handleStatusUpdate = async (id, status) => {
  if (!window.confirm("Are you sure this event is completed?")) return;

  try {
    await updateEventStatus(id, status);
    fetchEvents(); // refresh events
  } catch (err) {
    alert(
      err.response?.data?.message || "Failed to update status. Please try again."
    );
  }
};

const handleDeleteEvent = async (id) => {
  if (!window.confirm("Are you sure you want to delete this event?")) return;

  try {
    await deleteEvent(id);
    alert("Event deleted successfully!");
    fetchEvents(); // refresh list after deletion
  } catch (err) {
    console.error(err);
    alert("Failed to delete event. Please try again.");
  }
};

const [editingEventId, setEditingEventId] = useState(null);

const handleEditEvent = (event) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  setEditingEventId(event.id);
  setFormData({
    title: event.title,
    description: event.description,
    category: event.category,
    startDate: formatDate(event.startDate),
    endDate: formatDate(event.endDate),
    college: event.college,
    status: event.status,
    image: null, // image will be optional; user can upload a new one
  });
  setShowCreateModal(true);
};

// Fetch events from backend
  const fetchRegistartions = async () => {
    try {
      const res = await getRegistrations();
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRegistartions();
  }, []);
  const totalEvents = events.length;
  const activeEvents = events.filter((e) => e.status === "upcoming").length;
  const totalRegistrations=requests.filter((r)=>r.status==="accepted").length;
  const averageParticipants = events.length > 0 
  ? Math.round(requests.length / events.length) 
  : 0;

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
              className={`pb-2 ${activeTab === tab
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "hover:text-purple-600"
                }`}
            >
              {tab === "overview"
                ? "Overview"
                : tab === "my-events"
                  ? "My Events"
                  : "Feedback Analysis"}
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
                  <h2 className="text-xl font-bold">{totalRegistrations}</h2>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
                <BarChart2 className="text-orange-500" size={28} />
                <div>
                  <p className="text-gray-500 text-sm">Average Participants</p>
                  <h2 className="text-xl font-bold">{averageParticipants}</h2>
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
                  events.slice(0, 5).map((e) =>
                  (
                    <div
                      key={e.id}
                      className="flex justify-between items-center py-2 border-b last:border-b-0"
                    >
                      <span>{e.title}</span>

                      {e.status.toLowerCase() === "upcoming" ? (
                        <button
                          onClick={() => handleStatusUpdate(e.id, "completed")}
                          className="bg-green-500 text-white px-1 py-0.5 rounded-lg hover:bg-green-500 transition"
                        >
                          Mark Completed
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-400 text-white px-1 py-0.5 rounded-lg cursor-not-allowed"
                        >
                          Completed
                        </button>
                      )}
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
               <div
  key={e.id}
  className="relative flex items-center py-2 border-b last:border-b-0"
>
  {/* Left: Title + Description */}
  <div className="flex flex-col">
    <span className="font-medium text-gray-800">{e.title}</span>
    <span className="text-sm text-gray-500">{e.description}</span>
  </div>

  {/* Center: Status button */}
  <div className="absolute left-1/2 transform -translate-x-1/2">
    {e.status.toLowerCase() === "completed" ? (
      <button
        disabled
        className="bg-gray-400 text-white px-2 py-1 rounded-lg cursor-not-allowed"
      >
        Completed
      </button>
    ) : (
      <button
        onClick={() => handleStatusUpdate(e.id, "completed")}
        className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition"
      >
        Mark Completed
      </button>
    )}
  </div>

 <div className="ml-auto flex items-center gap-2">
<button onClick={()=>handleEditEvent(e)} className="text-blue-500 hover:text-blue-700 transition"
    title="Edit Event"> <Edit size={20} /></button>

    <button
      onClick={() => handleDeleteEvent(e.id)}
      className="text-red-500 hover:text-red-700 transition"
      title="Delete Event"
    >
      <Trash2 size={20} />
    </button>
  </div>
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
          <div className="bg-white w-[90%] max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto p-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
              Create New Event
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Title */}
              <input
                type="text"
                name="title"
                placeholder="Enter Event Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none text-lg"
              />

              {/* Description */}
              <textarea
                name="description"
                placeholder="Enter Event Description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none text-lg"
              />

              {/* Category & College */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="category"
                  placeholder="Category (e.g., Sports, Tech, Cultural)"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none text-lg"
                />

                <input
                  type="text"
                  name="college"
                  placeholder="College Name"
                  value={formData.college}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none text-lg"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-gray-600 text-sm mb-1 font-medium">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none text-lg"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-600 text-sm mb-1 font-medium">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none text-lg"
                  />
                </div>
              </div>

              {/* Image & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-600 cursor-pointer focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none text-lg"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
                >
                  Create Event
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
