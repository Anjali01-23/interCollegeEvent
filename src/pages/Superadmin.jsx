// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { deleteEvent } from "../../api/api";
import { Trash2 } from "lucide-react";
import { Edit } from "lucide-react";
import { updateEvent } from "../../api/api";
import { getAllFeedback, deleteFeedback } from "../../api/api";

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

// Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#7c3aed", "#06b6d4", "#f59e0b", "#10b981", "#ef4444"];

const Superadmin = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  // stats fetched from /api/feedback/stats
  const [feedbackStats, setFeedbackStats] = useState({
    counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    avgRating: 0,
    total: 0,
  });
  const [ratingTimeline, setRatingTimeline] = useState([]);

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

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch all feedback entries (cards)
  const fetchFeedbacks = async () => {
    try {
      const res = await getAllFeedback();
      console.log("Fetched feedbacks:", res.data);
      setFeedbacks(res.data || []);
      computeTimelineFromList(res.data || []);
    } catch (err) {
      console.error("Failed to fetch feedbacks:", err);
    }
  };

  // Fetch aggregated stats from backend endpoint
  const fetchFeedbackStats = async () => {
    try {
      const resp = await fetch("http://localhost:5000/api/feedback/stats");
      if (!resp.ok) throw new Error("Failed to fetch stats");
      const data = await resp.json();
      setFeedbackStats({
        counts: data.counts || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        avgRating: Number(data.avgRating) || 0,
        total: Number(data.total) || 0,
      });
    } catch (err) {
      console.error("Failed to load feedback stats:", err);
      // fallback: compute from feedbacks if available
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      feedbacks.forEach((f) => {
        const r = Number(f.rating) || 0;
        if (r >= 1 && r <= 5) counts[r] += 1;
      });
      const total = feedbacks.length;
      const avg =
        total > 0
          ? +(feedbacks.reduce((s, f) => s + (Number(f.rating) || 0), 0) / total).toFixed(2)
          : 0;
      setFeedbackStats({ counts, avgRating: avg, total });
    }
  };

  // compute rating timeline (avg per day) from feedback list — robust version
  const computeTimelineFromList = (list = []) => {
    const map = {};

    (list || []).forEach((f) => {
      const ts = f.created_at ?? f.createdAt ?? f.date ?? f.timestamp ?? f.createdOn ?? null;
      if (!ts) return;
      const d = new Date(ts);
      if (isNaN(d.getTime())) return;
      const isoDay = d.toISOString().slice(0, 10); // YYYY-MM-DD
      const rating = Number(f.rating) || 0;
      if (!map[isoDay]) map[isoDay] = { isoDay, total: 0, count: 0 };
      map[isoDay].total += rating;
      map[isoDay].count += 1;
    });

    const arr = Object.values(map)
      .map((v) => ({
        date: v.isoDay,
        displayDate: new Date(v.isoDay).toLocaleDateString(),
        avg: v.count ? +(v.total / v.count).toFixed(2) : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (arr.length === 0) {
      setRatingTimeline([{ date: "no-date", displayDate: "No date", avg: 0 }]);
      return;
    }

    setRatingTimeline(arr);
    console.log("ratingTimeline computed:", arr);
  };

  // load feedbacks/stats when user goes to analytics tab
  useEffect(() => {
    if (activeTab === "analytics") {
      fetchFeedbacks();
      fetchFeedbackStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Delete feedback
  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;

    try {
      await deleteFeedback(id);
      alert("Feedback deleted successfully!");
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      fetchFeedbackStats();
    } catch (err) {
      console.error(err);
      alert("Failed to delete feedback. Try again.");
    }
  };

  // Form change handler & submit
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const [editingEventId, setEditingEventId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (editingEventId) {
        await updateEvent(editingEventId, data);
        alert("Event updated successfully!");
      } else {
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
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status. Please try again.");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(id);
      alert("Event deleted successfully!");
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event. Please try again.");
    }
  };

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
      image: null,
    });
    setShowCreateModal(true);
  };

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      const res = await getRegistrations();
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    fetchFeedbackStats();
  }, []);

  const totalEvents = events.length;
  const activeEvents = events.filter((e) => e.status === "upcoming").length;
  const totalRegistrations = requests.filter((r) => r.status === "accepted").length;
  const averageParticipants =
    events.length > 0 ? Math.round(requests.length / events.length) : 0;

  // prepare chart data from stats
  const ratingCountsArray = [1, 2, 3, 4, 5].map((r) => ({
    rating: String(r),
    count: feedbackStats.counts?.[r] || 0,
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1020] text-gray-900 dark:text-gray-100">
      <Navbar />

      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl sm:text-2.5xl font-bold text-gray-900 dark:text-gray-100">Event Organizer Dashboard</h1>
          <div className="flex items-center gap-3"></div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {["overview", "my-events", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap pb-2 ${activeTab === tab ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-400" : "text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-300"}`}
            >
              {tab === "overview" ? "Overview" : tab === "my-events" ? "My Events" : "Feedback Analysis"}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 pb-8">
        {activeTab === "overview" && (
          <>
            {/* Stats Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center gap-3 border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl">
                <Calendar className="text-blue-500 dark:text-blue-300" size={28} />
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Total Events</p>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{totalEvents}</h2>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center gap-3 border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl">
                <Activity className="text-green-500 dark:text-green-300" size={28} />
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Active Events</p>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{activeEvents}</h2>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center gap-3 border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl">
                <Users className="text-purple-600 dark:text-purple-400" size={28} />
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Total Registrations</p>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{totalRegistrations}</h2>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center gap-3 border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl">
                <BarChart2 className="text-orange-500 dark:text-orange-400" size={28} />
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Average Participants</p>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{averageParticipants}</h2>
                </div>
              </div>
            </section>

            {/* Bottom Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Events */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2 mb-4 border-gray-200 dark:border-gray-700">Recent Events</h3>
                {events.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-300 text-sm">No recent events available.</p>
                ) : (
                  events.slice(0, 5).map((e) => (
                    <div key={e.id} className="flex justify-between items-center py-2 border-b last:border-b-0 border-gray-200 dark:border-gray-700 transform transition-transform duration-250 ease-out hover:-translate-y-1 hover:shadow-md">
                      <span className="truncate text-gray-900 dark:text-gray-100">{e.title}</span>

                      {e.status?.toLowerCase() === "upcoming" ? (
                        <button
                          onClick={() => handleStatusUpdate(e.id, "completed")}
                          className="bg-green-500 text-white px-2 py-0.5 rounded-lg hover:bg-green-600 transition text-sm"
                        >
                          Mark Completed
                        </button>
                      ) : (
                        <button disabled className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-lg cursor-not-allowed text-sm">
                          Completed
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Quick Actions + Pie */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Average Rating</h3>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-yellow-500">{feedbackStats.avgRating || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Based on {feedbackStats.total || 0} feedback(s)</div>
                </div>

                <div className="mt-4" style={{ height: 160 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={ratingCountsArray}
                        dataKey="count"
                        nameKey="rating"
                        innerRadius={36}
                        outerRadius={60}
                        paddingAngle={6}
                      >
                        {ratingCountsArray.map((entry, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" wrapperStyle={{ color: '#6b7280' }} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "my-events" && (
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">My Events</h2>

            {events.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">You haven’t created any events yet.</p>
            ) : (
              <div className="space-y-4">
                {events.map((e) => (
                  <div
                    key={e.id}
                    className="group relative bg-white/50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transform transition-transform duration-250 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-semibold text-lg text-gray-900 dark:text-gray-100 block truncate">{e.title}</span>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{e.description}</p>

                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300">
                            <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                              {e.category ?? "General"}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="text-gray-600 dark:text-gray-300">
                              {e.college ?? "—"}
                            </span>
                            {e.startDate && (
                              <span className="ml-2 text-gray-600 dark:text-gray-300">
                                {new Date(e.startDate).toLocaleDateString()}
                              </span>
                            )}
                            <span className="ml-2 text-gray-600 dark:text-gray-300">
                              {e.status.charAt(0).toUpperCase()+e.status.slice(1).toLowerCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* action buttons */}
                    <div className="mt-2 sm:mt-0 sm:ml-auto flex items-center gap-3">
                      <button
                        onClick={() => handleEditEvent(e)}
                        title="Edit Event"
                        className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 hover:scale-105 transform transition shadow-sm"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteEvent(e.id)}
                        title="Delete Event"
                        className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:scale-105 transform transition shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* subtle glowing outline on hover */}
                    <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/5 to-indigo-600/5 blur-sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <>
            {/* Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Average Rating</h3>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-yellow-500">{feedbackStats.avgRating || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Based on {feedbackStats.total || 0} feedback(s)</div>
                </div>

                <div className="mt-4" style={{ height: 160 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={ratingCountsArray}
                        dataKey="count"
                        nameKey="rating"
                        innerRadius={36}
                        outerRadius={60}
                        paddingAngle={6}
                      >
                        {ratingCountsArray.map((entry, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" wrapperStyle={{ color: '#6b7280' }} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Rating Distribution</h3>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer>
                    <BarChart data={ratingCountsArray} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="rating" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count">
                        {ratingCountsArray.map((entry, index) => (
                          <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* Timeline + cards */}
            <section className="grid grid-cols-1 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Average Rating Over Time</h3>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer>
                    <LineChart data={ratingTimeline} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        tickFormatter={(val) => {
                          const item = ratingTimeline.find((it) => it.date === val);
                          if (item && item.displayDate) return item.displayDate;
                          if (val === "no-date") return "No date";
                          return val ? val : "";
                        }}
                        interval={ratingTimeline.length > 10 ? Math.floor(ratingTimeline.length / 6) : "auto"}
                      />
                      <YAxis stroke="#6b7280" domain={[0, 5]} />
                      <Tooltip
                        formatter={(value) => [value, "Average"]}
                        labelFormatter={(label) => {
                          const item = ratingTimeline.find((it) => it.date === label);
                          return item?.displayDate ?? label;
                        }}
                      />
                      <Line type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <h1 className="text-lg font-bold text-gray-700 dark:text-gray-300 ml-3">Feedbacks Available</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feedbacks.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">No feedback available.</div>
                ) : (
                  feedbacks.map((f) => (
                    <div key={f.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 relative transform transition duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] hover:shadow-2xl">
                      <button onClick={() => handleDeleteFeedback(f.id)} className="absolute top-2 right-2 text-red-600 dark:text-red-400 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>

                      <p className="font-semibold text-gray-900 dark:text-gray-100">{f.student_name || f.name || "Anonymous"}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{f.student_email || f.email || ""}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{f.event_title || f.event_name || ""}</p>

                      <div className="flex items-center mb-2">
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} className={`mr-1 text-sm ${s <= (Number(f.rating)||0) ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                        ))}
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{f.rating ?? "-"}</span>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-200">{f.feedback || f.comment || "No comment provided."}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md md:max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto p-6 animate-fadeIn border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-4 text-center">Create / Edit Event</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="title"
                placeholder="Enter Event Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 focus:outline-none text-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />

              <textarea
                name="description"
                placeholder="Enter Event Description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 focus:outline-none text-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="category"
                  placeholder="Category (e.g., Sports, Tech, Cultural)"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 focus:outline-none text-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="text"
                  name="college"
                  placeholder="College Name"
                  value={formData.college}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 focus:outline-none text-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-gray-600 dark:text-gray-300 text-sm mb-1 font-medium">Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 focus:outline-none text-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-600 dark:text-gray-300 text-sm mb-1 font-medium">End Date</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 focus:outline-none text-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <input type="file" name="image" onChange={handleChange} accept="image/*" className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-gray-100 cursor-pointer focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 focus:outline-none bg-gray-50 dark:bg-gray-900" />

                <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 focus:outline-none text-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg shadow hover:opacity-90 transition">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Superadmin;
