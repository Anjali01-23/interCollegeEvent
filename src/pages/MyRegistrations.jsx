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

  // after imports
// --- inside MyRegistrations.jsx ---

useEffect(() => {
  const fetchRegistrations = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) return;
      const res = await getStudentRegistrations(user.id);
      const data = res.data || [];

      // Normalize registration objects so we always have `.id`
      const normalized = data.map((r) => ({
        ...r,
        // prefer existing id, else use registration_id
        id: r.id ?? r.registration_id ?? r.reg_id ?? r.registrationId,
      }));

      console.log("DEBUG: fetched registrations (normalized):", normalized);
      setRegistrations(normalized);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    }
  };
  fetchRegistrations();
}, []);


const handleCancel = async (registration) => {
  // Accept either an object or direct id
  const id =
    registration?.id ??
    registration?.registration_id ??
    registration?.reg_id ??
    registration?.registrationId ??
    registration; // fallback if caller passed id directly

  if (!id) {
    console.error("handleCancel: missing id for registration:", registration);
    alert("Unable to cancel: registration id not found (check console).");
    return;
  }

  if (!window.confirm("Are you sure you want to cancel this registration?")) return;

  try {
    await cancelRegistration(id); // api helper updated below
    alert("Registration cancelled successfully!");
    setRegistrations((prev) =>
      prev.filter((r) => String(r.id ?? r.registration_id ?? r.reg_id ?? r.registrationId) !== String(id))
    );
  } catch (err) {
    console.error("Cancel failed", err);
    const serverMsg = err?.response?.data?.message || err.message || "Unknown error";
    alert("Failed to cancel registration: " + serverMsg);
  }
};


  // Filter registrations
  const filteredRegistrations = registrations.filter((p) =>
    (p.event_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 px-4 sm:px-6 lg:px-8 py-6 text-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-4">My Registrations</h1>

          {/* Search */}
          <div className="relative mb-6 max-w-full">
            <input
              type="text"
              placeholder="Search by event name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800 text-gray-100 placeholder-gray-400"
            />
            <Search size={18} className="absolute top-2.5 left-3 text-gray-400" />
          </div>

          {filteredRegistrations.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 shadow text-center text-gray-400">
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
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center border rounded-xl p-4 shadow-sm bg-gray-800 hover:shadow-md transition border-gray-700"
                  >
                    {/* Left: event info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-100 truncate">{r.event_name}</h3>
                      <div className="mt-2 flex items-center text-sm text-gray-400 gap-3">
                        <CalendarDays size={16} className="text-purple-400" />
                        <span>Starts: {startDateStr}</span>
                        {r.college && <span className="hidden sm:inline">• {r.college}</span>}
                      </div>
                      {r.additional_info && (
                        <p className="mt-2 text-sm text-gray-400 hidden md:block truncate">{r.additional_info}</p>
                      )}
                    </div>

                    {/* Right: status & action */}
                    <div className="mt-3 sm:mt-0 sm:ml-6 flex-shrink-0 flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          r.status === "accepted"
                            ? "bg-green-900 text-green-300"
                            : r.status === "rejected"
                            ? "bg-red-900 text-red-300"
                            : "bg-yellow-900 text-yellow-300"
                        }`}
                      >
                        {r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : "Pending"}
                      </span>

                      {r.status === "pending" ? (
                        <button
                          onClick={() => handleCancel(r)}
                          className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium px-3 py-2 rounded-md border border-red-700 bg-gray-900"
                        >
                          <XCircle size={16} />
                          <span>Cancel</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-2 text-sm rounded-md bg-gray-700 text-gray-400 cursor-not-allowed"
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
