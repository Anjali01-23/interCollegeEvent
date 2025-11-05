// src/pages/AllEvents.jsx
import React, { useState, useEffect } from "react";
import { Search, Calendar, X } from "lucide-react";
import Navbar from "../components/Navbar";
import {
  getEvents,
  getStudentRegistrations,
  createRegistration,
  createFeedback,
  getStudentFeedbacks,
} from "../../api/api";

export default function AllEvents() {
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [typeFilter, setTypeFilter] = useState("All Category");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [events, setEvents] = useState([]);
  const [selectedEventForReg, setSelectedEventForReg] = useState(null);

  const [showRegModal, setShowRegModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  // Store registered event ids as string keys
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());

  // stores event ids for which the current student already gave feedback
  const [feedbackGiven, setFeedbackGiven] = useState(new Set());

  const [regForm, setRegForm] = useState({
    name: "",
    college: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
  });

  // ===== Registration Form Handlers =====
  const handleRegChange = (e) => {
    const { name, value } = e.target;
    setRegForm({ ...regForm, [name]: value });
  };

  const handlecross = () => {
    setShowRegModal(false);
    setRegForm({
      name: "",
      college: "",
      age: "",
      gender: "",
      email: "",
      phone: "",
    });
  };

  // ===== Fetch Events =====
  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data || []);
      return res.data || [];
    } catch (err) {
      console.error("Failed to fetch events", err);
      return [];
    }
  };

  useEffect(() => {
    // load events on mount
    fetchEvents();
  }, []);

  // ===== Load student feedbacks (so we know which events user already rated) =====
  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) return;

        const res = await getStudentFeedbacks(user.id);
        // create a set of event ids (string)
        const ids = new Set((res.data || []).map((fb) => String(fb.event_id)));
        setFeedbackGiven(ids);
      } catch (err) {
        // If 404 or other error, log but don't crash the page
        console.error("Failed to load feedbacks", err);
      }
    };
    loadFeedbacks();
  }, []);

  // fetch student registrations (for disabling register button)
  useEffect(() => {
    const loadStudentRegs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) return;

        // Ensure events are loaded so we can try matching by name if event_id missing
        let currentEvents = events;
        if (!currentEvents || currentEvents.length === 0) {
          currentEvents = await fetchEvents();
        }

        const res = await getStudentRegistrations(user.id);
        const ids = new Set(
          (res.data || [])
            .map((r) => {
              // Try common event id keys first
              const idFromRow = r.event_id ?? r.eventId ?? r.event;
              if (idFromRow !== undefined && idFromRow !== null) return String(idFromRow);

              // fallback: try to match by event_name against loaded events
              if (r.event_name && currentEvents && currentEvents.length > 0) {
                const match = currentEvents.find(
                  (ev) =>
                    (ev.title && ev.title.toString().trim().toLowerCase()) ===
                    r.event_name.toString().trim().toLowerCase()
                );
                if (match) return String(match.id ?? match._id);
              }

              // If nothing found, return undefined (will be filtered out)
              return undefined;
            })
            .filter((v) => v !== undefined && v !== null)
        );

        setRegisteredEventIds(ids);
      } catch (err) {
        console.error("Failed to load student registrations", err);
      }
    };
    loadStudentRegs();
    // We intentionally do not include `events` as dependency to avoid re-running too often.
  }, []); // run once on mount

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) return alert("User not found - please login again.");

      const eventIdValue = selectedEventForReg?.id ?? selectedEventForReg?._id;
      if (!eventIdValue) {
        alert("Event id missing. Cannot register.");
        return;
      }

      const payload = {
        student_id: Number(user.id),
        event_id: Number(eventIdValue),
        ...regForm,
        status: "pending",
      };

      await createRegistration(payload);

      // refresh student registrations from server (recommended)
      const res = await getStudentRegistrations(user.id);
      const ids = new Set(
        (res.data || [])
          .map((r) => {
            const idFromRow = r.event_id ?? r.eventId ?? r.event;
            if (idFromRow !== undefined && idFromRow !== null) return String(idFromRow);
            if (r.event_name) {
              const match = (events || []).find(
                (ev) =>
                  (ev.title && ev.title.toString().trim().toLowerCase()) ===
                  r.event_name.toString().trim().toLowerCase()
              );
              if (match) return String(match.id ?? match._id);
            }
            return undefined;
          })
          .filter((v) => v !== undefined && v !== null)
      );
      setRegisteredEventIds(ids);

      alert("Registration submitted successfully!");
      setShowRegModal(false);
      setRegForm({ name: "", college: "", age: "", gender: "", email: "", phone: "" });
    } catch (err) {
      console.error("Registration failed", err, err.response?.data);
      const serverMsg = err.response?.data?.message || JSON.stringify(err.response?.data) || err.message;
      alert("Failed to submit registration: " + serverMsg);
    }
  };

  // ===== Filter Logic =====
  const filtered = events.filter((ev) => {
    const matchSearch = ev.title?.toLowerCase().includes(search.toLowerCase());
    const matchType =
      typeFilter === "All Category" ||
      (ev.category && ev.category.toLowerCase() === typeFilter.toLowerCase());
    const matchStatus =
      statusFilter === "All Status" ||
      (ev.status && ev.status.toLowerCase() === statusFilter.toLowerCase());

    return matchSearch && matchType && matchStatus;
  });

  // Helper: format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const handleFeedbackSubmit = async () => {
    if (!rating || !feedbackText.trim()) {
      alert("Please give a rating and write feedback before submitting!");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const studentId = user.id;
      const eventId = selectedEventForReg ? (selectedEventForReg.id || selectedEventForReg._id) : null;

      const payload = {
        student_id: studentId,
        event_id: eventId,
        rating,
        feedback: feedbackText,
      };

      await createFeedback(payload);

      // success: add this event id to feedbackGiven so UI updates immediately
      setFeedbackGiven((prev) => new Set(prev).add(String(eventId)));

      alert("Feedback submitted successfully!");
      setShowFeedback(false);
      setRating(0);
      setFeedbackText("");
    } catch (err) {
      console.error("Failed to submit feedback", err);

      // if backend returns 409 for duplicate, show friendly message
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message || err.message;

      if (status === 409) {
        alert(serverMsg || "You have already submitted feedback for this event.");
        // ensure local state is consistent (in case server already had it)
        const eventId = selectedEventForReg ? (selectedEventForReg.id || selectedEventForReg._id) : null;
        if (eventId) setFeedbackGiven((prev) => new Set(prev).add(String(eventId)));
        setShowFeedback(false);
      } else {
        alert("Failed to submit feedback. Try again! " + serverMsg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />

      {/* ===== Main ===== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100 mb-6">All Events</h1>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800 text-gray-100 placeholder-gray-400"
          />
          <Search size={18} className="absolute top-2.5 left-3 text-gray-400" />
        </div>

        {/* Filters */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-700 mb-8">
          <p className="font-semibold text-gray-200 mb-4">Filters</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select
              className="border border-gray-700 rounded-lg p-2 bg-gray-800 text-gray-100"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>All Category</option>
              <option>Cultural</option>
              <option>Hackathon</option>
              <option>Sports</option>
            </select>

            <select
              className="border border-gray-700 rounded-lg p-2 bg-gray-800 text-gray-100"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Completed</option>
              <option>Upcoming</option>
            </select>

            <button
              onClick={() => {
                setTypeFilter("All Category");
                setStatusFilter("All Status");
                setSearch("");
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* ===== Events Grid ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => {
            // normalize event key to string
            const eventKey = String(event.id ?? event._id ?? "");
            const isRegistered = registeredEventIds.has(eventKey);
            const hasGivenFeedback = feedbackGiven.has(String(event.id ?? event._id));

            return (
              <article
                key={event.id ?? event._id}
                onClick={() => setSelectedEvent(event)}
                className="bg-gray-800 rounded-xl shadow hover:shadow-md transition border border-gray-700 overflow-hidden transform hover:scale-[1.02] cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={`http://localhost:5000/uploads/${event.image}`}
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-44 sm:h-48 md:h-56 object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full shadow-sm">
                      {event.status}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h2 className="font-bold text-lg text-gray-100 mb-1 truncate">{event.title}</h2>
                  <p className="text-gray-300 text-sm truncate">{event.college}</p>
                  <div className="flex items-center text-sm text-gray-400 mt-2">
                    <Calendar size={16} className="mr-1 text-gray-300" />
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </div>

                  {/* Register + Feedback Buttons */}
                  <div className="mt-3 flex flex-col sm:flex-row gap-3">
                    {isRegistered ? (
                      <button
                        className="w-full sm:w-1/2 bg-gray-600 text-gray-300 py-2 rounded-lg cursor-not-allowed"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("You have already registered for this event.");
                        }}
                      >
                        Registered
                      </button>
                    ) : (event.status && event.status.toLowerCase() === "upcoming" ? (
                      <button
                        className="w-full sm:w-1/2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEventForReg(event);
                          setShowRegModal(true);
                        }}
                      >
                        Register
                      </button>
                    ) : (
                      <button
                        className="w-full sm:w-1/2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                         alert("Event is already completed so you can't register");
                        }}
                      >
                        Register
                      </button>
                    )
                    )}

                    {/* Feedback button: prevents opening modal if already given */}
                    {event.status && event.status.toLowerCase() === "completed" ? (
                      hasGivenFeedback ? (
                        <button
                          className="w-full sm:w-1/2 bg-gray-600 text-gray-300 py-2 rounded-lg cursor-not-allowed"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("You have already given feedback for this event.");
                          }}
                        >
                          Feedback Given
                        </button>
                      ) : (
                        <button
                          className="w-full sm:w-1/2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEventForReg(event);
                            setShowFeedback(true);
                          }}
                        >
                          Give Feedback
                        </button>
                      )
                    ) : (
                      <button
                        className="w-full sm:w-1/2 bg-gray-600 text-gray-300 py-2 rounded-lg cursor-not-allowed"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("Event is still upcoming. Feedback allowed only after event is completed.");
                        }}
                      >
                        Give Feedback
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 mt-8">No events match your filters.</p>
        )}
      </main>

      {/* ===== Event Detail Modal ===== */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 w-full max-w-3xl md:max-w-4xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn border border-gray-700">
            <div className="relative">
              <img
                src={`http://localhost:5000/uploads/${selectedEvent.image}`}
                alt={selectedEvent.title}
                className="w-full h-60 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-gray-700 rounded-full p-2 shadow hover:bg-purple-700 transition"
              >
                <X size={22} className="text-white" />
              </button>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-purple-300 mb-2">{selectedEvent.title}</h2>
              <p className="text-gray-300 mb-4">College: {selectedEvent.college}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Info label="Start Date" value={formatDate(selectedEvent.startDate)} />
                <Info label="End Date" value={formatDate(selectedEvent.endDate)} />
                <Info label="Category" value={selectedEvent.category} />
                <Info label="Status" value={selectedEvent.status} />
              </div>

              <div className="mb-4">
                <p className="font-semibold text-gray-100">Description</p>
                <p className="text-gray-300 text-sm">{selectedEvent.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Registration Modal ===== */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md md:max-w-lg p-6 animate-fadeIn relative border border-gray-700">
            <button onClick={handlecross} className="absolute top-3 right-3 text-gray-300 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-purple-300 mb-4 text-center">Event Registration</h2>

            <form onSubmit={handleRegSubmit} className="space-y-3">
              {["name", "college", "age", "email", "phone"].map((field) => (
                <input
                  key={field}
                  type={field === "age" ? "number" : "text"}
                  name={field}
                  value={regForm[field]}
                  onChange={handleRegChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  required
                  className="w-full border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none bg-gray-900 text-gray-100"
                />
              ))}

              <select
                name="gender"
                value={regForm.gender}
                onChange={handleRegChange}
                required
                className="w-full border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none bg-gray-900 text-gray-100"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
                Submit Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===== Feedback Modal ===== */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4">
          <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md md:max-w-lg p-6 animate-fadeIn relative border border-gray-700">
            {/* Close Button */}
            <button onClick={() => setShowFeedback(false)} className="absolute top-3 right-3 text-gray-300 hover:text-white">
              <X size={20} />
            </button>

            {/* Modal Title */}
            <h2 className="text-xl font-bold text-purple-300 mb-4 text-center">Give Feedback</h2>

            {selectedEventForReg && <p className="text-sm text-gray-300 mb-2 text-center">Event: {selectedEventForReg.title}</p>}

            {/* Rating Selection */}
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-500"}`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Feedback Textarea */}
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Write your feedback..."
              className="w-full border border-gray-700 rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-purple-500 outline-none bg-gray-900 text-gray-100"
            />

            {/* Submit Button */}
            <button onClick={handleFeedbackSubmit} className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Component
const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="font-semibold text-gray-100">{value}</p>
  </div>
);
