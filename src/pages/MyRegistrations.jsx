import React from "react";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getStudentRegistrations } from "../../api/api";
import { cancelRegistration } from "../../api/api";
import { CalendarDays } from "lucide-react";
import { XCircle } from "lucide-react";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) return;
        const res = await getStudentRegistrations(user.id);
        setRegistrations(res.data || []);
      } catch (err) {
        console.error("Failed to fetch registrations", err);
      }
    };
    fetchRegistrations();
  }, []);

  // Cancel Registration
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

  // Filter registrations
  const filteredRegistrations = registrations.filter((p) =>
    (p.event_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">My Registrations</h1>

          {/* Search */}
          <div className="relative mb-6 max-w-full">
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
            <div className="bg-white rounded-lg p-6 shadow text-center text-gray-600">
              No registrations found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegistrations.map((r) => {
                // defensive date handling
                const startDate = r.start_date ? new Date(r.start_date) : null;
                const startDateStr = startDate ? startDate.toLocaleDateString() : "N/A";

                return (
                  <div
                    key={r.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
                  >
                    {/* Left: event info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{r.event_name}</h3>
                      <div className="mt-2 flex items-center text-sm text-gray-500 gap-3">
                        <CalendarDays size={16} className="text-purple-500" />
                        <span>Starts: {startDateStr}</span>
                        {r.college && <span className="hidden sm:inline">• {r.college}</span>}
                      </div>
                      {r.additional_info && (
                        <p className="mt-2 text-sm text-gray-500 hidden md:block truncate">{r.additional_info}</p>
                      )}
                    </div>

                    {/* Right: status & action */}
                    <div className="mt-3 sm:mt-0 sm:ml-6 flex-shrink-0 flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          r.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : r.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : "Pending"}
                      </span>

                      {r.status === "pending" ? (
                        <button
                          onClick={() => handleCancel(r.id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium px-3 py-2 rounded-md border border-red-100 bg-white"
                        >
                          <XCircle size={16} />
                          <span>Cancel</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                        >
                          {r.status === "accepted" ? "Accepted" : r.status === "rejected" ? "Rejected" : "Status"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyRegistrations;
