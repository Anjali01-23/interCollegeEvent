import React, { useState, useEffect } from "react";
import { Search, Calendar, X } from "lucide-react";
import Navbar from "../components/Navbar";
import { getEvents } from "../../api/api"; // Import your API functions

export default function AllEvents() {
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [typeFilter, setTypeFilter] = useState("All Category");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [events, setEvents] = useState([]);

  // Fetch events from backend
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data); // assuming res.data is an array of events
    } catch (err) {
      console.error(err);
    }
  };

  // Filter logic
  const filtered = events.filter((ev) => {
    const matchSearch = ev.title.toLowerCase().includes(search.toLowerCase());
    const matchType =
      typeFilter === "All Category" || ev.category.toLowerCase() === typeFilter.toLowerCase();
    const matchStatus =
      statusFilter === "All Status" || ev.status.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchType && matchStatus;
  });

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
              onClick={() => { setTypeFilter("All Category"); setStatusFilter("All Status"); setSearch(""); }}
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
  key={event._id}
  onClick={() => setSelectedEvent(event)} // 👈 this opens the popup
  className="bg-white rounded-xl shadow hover:shadow-md transition border border-gray-100 overflow-hidden transform hover:scale-[1.02] cursor-pointer"
>

              <div className="relative">
                <img
                  src={`http://localhost:5000/uploads/${event.image}`} // adjust path if needed
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
                {/* Register Button */}
                <button
  className="mt-3 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
  onClick={(e) => {
    e.stopPropagation(); // stops the card click from triggering
    alert("Registration functionality coming soon!");
  }}
>
  Register
</button>
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

            {/* Details */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-2">{selectedEvent.title}</h2>
              <p className="text-gray-600 mb-4">College: {selectedEvent.college}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Info label="Start Date" value={new Date(selectedEvent.startDate).toLocaleDateString()} />
                <Info label="End Date" value={new Date(selectedEvent.endDate).toLocaleDateString()} />
                <Info label="Category" value={selectedEvent.category} />
                <Info label="Status" value={selectedEvent.status} />
              </div>

              <div className="mb-4">
             <p className="font-semibold text-gray-800">Description</p>
             <p className="text-gray-600 text-sm">{selectedEvent.description}</p>
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
