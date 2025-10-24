import React, { useState, useEffect } from "react";
import { Search, Calendar, X } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { getEvents } from "../../api/api";
import { createRegistration } from "../../api/api";
import { createFeedback } from "../../api/api";

export default function AllEvents() {
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [typeFilter, setTypeFilter] = useState("All Category");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [events, setEvents] = useState([]);
  const [selectedEventForReg, setSelectedEventForReg] = useState(null);

  const [showRegModal, setShowRegModal] = useState(false);
  const [showFeedback,setShowFeedback]=useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");



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

  const handlecross=()=>{
    setShowRegModal(false);
    setRegForm({
        name: "",
        college: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
      });
  }
  const handleRegSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const user=JSON.parse(localStorage.getItem("user"));
      const studentId=user.id;
      const payload = {
      student_id: studentId,       // mandatory
      event_id: selectedEventForReg.id,   // mandatory
      ...regForm,                  // form fields: name, college, age, gender, email, phone
      status: "pending",           // default status
      };
      console.log(payload);
      await createRegistration(payload);
      alert("Registration submitted successfully!");
      setShowRegModal(false);
      setRegForm({
        name: "",
        college: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to submit registration. Try again.");
    }
  };

  // ===== Fetch Events =====
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Filter Logic =====
  const filtered = events.filter((ev) => {
    const matchSearch = ev.title.toLowerCase().includes(search.toLowerCase());
    const matchType =
      typeFilter === "All Category" ||
      ev.category.toLowerCase() === typeFilter.toLowerCase();
    const matchStatus =
      statusFilter === "All Status" ||
      ev.status.toLowerCase() === statusFilter.toLowerCase();

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

    const payload = {
      student_id: studentId,
      event_id: selectedEventForReg ? selectedEventForReg.id : null,
      rating,
      feedback: feedbackText,
    };

    await createFeedback(payload);

    alert("Feedback submitted successfully!");
    setShowFeedback(false);
    setRating(0);
    setFeedbackText("");
  } catch (err) {
    console.error(err);
    alert("Failed to submit feedback. Try again!");
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ===== Main ===== */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">All Events</h1>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search size={18} className="absolute top-2.5 left-3 text-gray-400" />
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
          <p className="font-semibold text-gray-700 mb-4">Filters</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select
              className="border border-gray-300 rounded-lg p-2"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>All Category</option>
              <option>Cultural</option>
              <option>Hackathon</option>
              <option>Sports</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg p-2"
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
              className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-600 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* ===== Events Grid ===== */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <div
              key={event._id}
              onClick={() => setSelectedEvent(event)}
              className="bg-white rounded-xl shadow hover:shadow-md transition border border-gray-100 overflow-hidden transform hover:scale-[1.02] cursor-pointer"
            >
              <div className="relative">
                <img
                  src={`http://localhost:5000/uploads/${event.image}`}
                  alt={event.title}
                  className="w-full h-44 object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full shadow-sm">
                    {event.status}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h2 className="font-bold text-lg text-gray-800 mb-1">
                  {event.title}
                </h2>
                <p className="text-gray-600 text-sm">{event.college}</p>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Calendar size={16} className="mr-1" />
                  {formatDate(event.startDate)} - {formatDate(event.endDate)}
                </div>

                {/* Register Button */}
                <div className="flex w-full gap-3">
                <button
                  className="mt-3 w-1/2 mr-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEventForReg(event);
                    setShowRegModal(true);
                  }}
                >
                  Register
                </button>

                {event.status && event.status.toLowerCase() === "completed" ? (
    <button
      className="mt-3 w-1/2 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedEventForReg(event);
        setShowFeedback(true);
      }}
    >
      Give Feedback
    </button>
  ) : (
    <button
      className="mt-3 w-1/2 bg-gray-300 text-gray-700 py-2 rounded-lg cursor-not-allowed"
      onClick={(e) => {
        e.stopPropagation();
        // optional toast/alert
        alert("Event is still upcoming. Feedback allowed only after event is completed.");
      }}
    >
      Give Feedback
    </button>
  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No events match your filters.
          </p>
        )}
      </main>

      {/* ===== Event Detail Modal ===== */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-3xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="relative">
              <img
                src={`http://localhost:5000/uploads/${selectedEvent.image}`}
                alt={selectedEvent.title}
                className="w-full h-60 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-purple-100 transition"
              >
                <X size={22} className="text-purple-600" />
              </button>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-2">
                {selectedEvent.title}
              </h2>
              <p className="text-gray-600 mb-4">
                College: {selectedEvent.college}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Info label="Start Date" value={formatDate(selectedEvent.startDate)} />
                <Info label="End Date" value={formatDate(selectedEvent.endDate)} />
                <Info label="Category" value={selectedEvent.category} />
                <Info label="Status" value={selectedEvent.status} />
              </div>

              <div className="mb-4">
                <p className="font-semibold text-gray-800">Description</p>
                <p className="text-gray-600 text-sm">
                  {selectedEvent.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Registration Modal ===== */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 animate-fadeIn relative">
            <button
              onClick={handlecross}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-purple-700 mb-4 text-center">
              Event Registration
            </h2>

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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              ))}

              <select
                name="gender"
                value={regForm.gender}
                onChange={handleRegChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
              >
                Submit Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===== Feedback Modal ===== */}
{showFeedback && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
    <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 animate-fadeIn relative">
      {/* Close Button */}
      <button
        onClick={() => setShowFeedback(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        <X size={20} />
      </button>

      {/* Modal Title */}
      <h2 className="text-xl font-bold text-purple-700 mb-4 text-center">
        Give Feedback
      </h2>
      
      {selectedEventForReg && (
  <p className="text-sm text-gray-700 mb-2 text-center">Event: {selectedEventForReg.title}</p>
)}

      {/* Rating Selection */}
      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            className={`cursor-pointer text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
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
        className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-purple-500 outline-none"
      />

      {/* Submit Button */}
      <button
        onClick={handleFeedbackSubmit}
        className="mt-4 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
      >
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
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold text-gray-700">{value}</p>
  </div>
);
