import React from 'react'
import Navbar from '../components/Navbar'
import { useEffect, useState } from "react";
import { Search} from "lucide-react";
import { getStudentRegistrations } from '../../api/api';
import { cancelRegistration } from '../../api/api';
import { CalendarDays } from 'lucide-react';
import { XCircle } from 'lucide-react';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await getStudentRegistrations(user.id);
        setRegistrations(res.data);
      } catch (err) {
        console.error("Failed to fetch registrations", err);
      }
    };
    fetchRegistrations();
  }, []);

 //Cancel Registration
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this registration?")) return;
    try {
      await cancelRegistration(id);
      alert("Registration cancelled successfully!");
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Cancel failed", err);
      alert("Failed to cancel registration");
    }
  };

   //Filter participants based on search query
  const filteredRegistrations = registrations.filter((p) =>
    p.event_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 px-6 py-7">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">My Registrations</h1>
    
    {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search by event name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search size={18} className="absolute top-2.5 left-3 text-gray-500" />
            </div>

            {filteredRegistrations.length === 0 ? (
        <p>No registrations found</p>
      ) : (
        <div className="space-y-4">
          {filteredRegistrations.map((r) => (
            <div
              key={r.id}
              className="flex justify-between items-center border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              {/* Left side: event info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{r.event_name}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <CalendarDays size={16} className="mr-1 text-purple-500" />
                  <span>Starts: {new Date(r.start_date).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Right side: status & action */}
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    r.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : r.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </span>

                {r.status === "pending" && (
                  <button
                    onClick={() => handleCancel(r.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
                  >
                    <XCircle size={16} />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  )
}

export default MyRegistrations
