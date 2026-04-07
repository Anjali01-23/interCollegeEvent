import React from "react";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Search, CalendarDays, XCircle } from "lucide-react";
import { getStudentRegistrations, cancelRegistration } from "../../api/api";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) return;
        const res = await getStudentRegistrations(user.id);
        const data = res.data || [];

        const normalized = data.map((r) => ({
          ...r,
          id: r.id ?? r.registration_id ?? r.reg_id ?? r.registrationId,
        }));

        setRegistrations(normalized);
      } catch (err) {
        console.error("Failed to fetch registrations", err);
      }
    };
    fetchRegistrations();
  }, []);

  const handleCancel = async (registration) => {
    const id =
      registration?.id ??
      registration?.registration_id ??
      registration?.reg_id ??
      registration?.registrationId ??
      registration;

    if (!id) return alert("Registration ID not found");

    if (!window.confirm("Are you sure?")) return;

    try {
      await cancelRegistration(id);
      alert("Registration cancelled!");
      setRegistrations((prev) =>
        prev.filter((r) => String(r.id) !== String(id))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to cancel");
    }
  };

  const filteredRegistrations = registrations.filter((p) =>
    (p.event_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-6 text-gray-900 dark:text-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            My Registrations
          </h1>

          {/* SEARCH */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search by event name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>

          {/* NO RESULTS */}
          {filteredRegistrations.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
            p-6 rounded-lg shadow text-center text-gray-600 dark:text-gray-300">
              No registrations found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegistrations.map((r) => {
                const startDate = r.start_date
                  ? new Date(r.start_date).toLocaleDateString()
                  : "N/A";

                return (
                  <div
                    key={r.id}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                    rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    {/* TOP ROW */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      {/* LEFT SIDE */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold truncate">
                          {r.event_name}
                        </h3>

                        <div className="mt-2 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                          <CalendarDays size={16} className="text-purple-500" />
                          <span>Starts: {startDate}</span>
                          {r.college && (
                            <span className="hidden sm:inline">• {r.college}</span>
                          )}
                        </div>

                        {r.additional_info && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 truncate hidden md:block">
                            {r.additional_info}
                          </p>
                        )}
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="mt-3 sm:mt-0 flex items-center gap-3">
                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium
                          ${
                            r.status === "accepted"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : r.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {r.status
                            ? r.status.charAt(0).toUpperCase() + r.status.slice(1)
                            : "Pending"}
                        </span>

                        {/* Cancel Button */}
                        {r.status === "pending" ? (
                          <button
                            onClick={() => handleCancel(r)}
                            className="flex items-center gap-2 border border-red-300 dark:border-red-700 
                            bg-white dark:bg-gray-900 text-red-600 dark:text-red-300 
                            px-3 py-2 rounded-md"
                          >
                            <XCircle size={16} />
                            Cancel
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 
                            text-gray-700 dark:text-gray-300 cursor-not-allowed"
                          >
                            {r.status === "accepted"
                              ? "Accepted"
                              : r.status === "rejected"
                              ? "Rejected"
                              : "Status"}
                          </button>
                        )}
                      </div>
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
