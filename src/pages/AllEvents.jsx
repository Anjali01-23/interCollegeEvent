import React, { useState } from "react";
import { Search, Calendar, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AllEvents() {
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const navigate = useNavigate();

  // Updated events: type and status as strings
  const events = [
    {
      id: 1,
      title: "Cultural Fest - Harmony 2024",
      college: "Arts College",
      date: "2/9/2024",
      time: "11:30 PM",
      location: "City Cultural Center",
      participants: "342 / 500",
      type: "Cultural",
      status: "Completed",
      tags: ["music", "dance", "art", "culture"],
      image:
        "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?q=80&w=1200",
    },
    {
      id: 2,
      title: "Inter-College Hackathon",
      college: "Engineering College",
      date: "21/12/2024",
      time: "10:00 AM",
      location: "Tech Park",
      participants: "210 / 300",
      type: "Hackathon",
      status: "Completed",
      tags: ["hackathon", "coding", "innovation"],
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200",
    },
    {
      id: 3,
      title: "Cycling Championship",
      college: "Sports College",
      date: "20/11/2025",
      time: "3:00 PM",
      location: "National Stadium",
      participants: "150 / 200",
      type: "Sports",
      status: "Upcoming",
      tags: ["cycling", "tournament"],
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
  ];

  // Filter logic
  const filtered = events.filter((ev) => {
    const matchSearch = ev.title.toLowerCase().includes(search.toLowerCase());
    const matchType =
      typeFilter === "All Types" || ev.type.toLowerCase() === typeFilter.toLowerCase();
    const matchStatus =
      statusFilter === "All Status" || ev.status.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== Header ===== */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-purple-600 font-bold text-xl">CampusEventHub</span>
          <nav className="hidden md:flex gap-6 text-gray-600 font-medium">
            <a href="#" className="text-purple-600">Events</a>
            <button
              onClick={() => navigate("/dashboard")}
              className="hover:text-purple-600"
            >
              Dashboard
            </button>
          </nav>
        </div>
      </header>

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
              <option>All Types</option>
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
              onClick={() => { setTypeFilter("All Types"); setStatusFilter("All Status"); setSearch(""); }}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-600 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="bg-white rounded-xl shadow hover:shadow-md transition border border-gray-100 overflow-hidden cursor-pointer transform hover:scale-[1.02]"
            >
              <div className="relative">
                <img
                  src={event.image}
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
                <h2 className="font-bold text-lg text-gray-800 mb-1">{event.title}</h2>
                <p className="text-gray-600 text-sm">{event.college}</p>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Calendar size={16} className="mr-1" />
                  {event.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No events match your filters.</p>
        )}
      </main>

      {/* ===== Modal ===== */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-3xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            {/* Header Image */}
            <div className="relative">
              <img
                src={selectedEvent.image}
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

            {/* Details */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-2">{selectedEvent.title}</h2>
              <p className="text-gray-600 mb-4">College: {selectedEvent.college}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Info label="Date" value={selectedEvent.date} />
                <Info label="Start Time" value={selectedEvent.time} />
                <Info label="Location" value={selectedEvent.location} />
                <Info label="Participants" value={selectedEvent.participants} />
              </div>

              <div className="mb-4">
                <p className="font-semibold text-gray-800">Tags</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {selectedEvent.tags.map((tag, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="font-semibold text-gray-800">Requirements</p>
                <p className="text-gray-600 text-sm">Registration required for participation.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Prizes</p>
                <p className="text-gray-600 text-sm">Exciting prizes await!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component
const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold text-gray-700">{value}</p>
  </div>
);
