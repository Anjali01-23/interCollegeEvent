// src/components/anotherparticipants/AdminData.jsx
import React, { useEffect, useState } from "react";
import { getAllAdminRequests } from "../../../api/api";

/**
 * AdminData — supports both light and dark mode via tailwind `dark:` variants
 */

const AdminData = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllAdminRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filter + Search
  const filteredRequests = (requests || []).filter((req) => {
    const matchesFilter =
      filter === "All" ? true : (req.status || "").toLowerCase() === filter.toLowerCase();
    const text = `${req.college || ""} ${req.email || ""} ${req.name || ""}`.toLowerCase();
    const matchesSearch = text.includes(search.trim().toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatStatus = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "Unknown";

  // Export visible rows to CSV
  const exportCSV = () => {
    const rows = filteredRequests;
    if (!rows.length) {
      alert("No data to export.");
      return;
    }

    const headers = ["ID", "Name", "Email", "Event ID", "Status"];
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        [
          r.id,
          `"${(r.name || "").replace(/"/g, '""')}"`,
          `"${(r.email || "").replace(/"/g, '""')}"`,
          r.event_id ?? "",
          r.status ?? "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin_requests_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Requests</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">View and filter all admin requests</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search college / email / name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-md w-60 text-sm
                       bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700
                       text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500"
          />

          <select
            className="border px-3 py-2 rounded-md text-sm
                       bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700
                       text-gray-800 dark:text-gray-100 focus:outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:opacity-90 focus:outline-none"
            title="Export visible rows to CSV"
          >
            Export Data
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-6 text-center text-gray-500 dark:text-gray-300">
          Loading requests…
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-4 text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-6 text-center text-gray-500 dark:text-gray-300">
          No requests found
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-lg shadow overflow-auto border border-gray-200 dark:border-gray-700">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 dark:bg-gray-900 text-left text-sm text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="p-4 border-b border-gray-200 dark:border-gray-700">ID</th>
                  <th className="p-4 border-b border-gray-200 dark:border-gray-700">Email</th>
                  <th className="p-4 border-b border-gray-200 dark:border-gray-700">College Name</th>
                  <th className="p-4 border-b border-gray-200 dark:border-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="p-3 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                      {req.id}
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                      {req.email}
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                      {req.college}
                    </td>
                    <td
                      className={`p-3 text-sm border-b border-gray-200 dark:border-gray-700 font-semibold ${
                        req.status === "approved"
                          ? "text-green-600 dark:text-green-400"
                          : req.status === "rejected"
                          ? "text-red-600 dark:text-red-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {formatStatus(req.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{req.name || req.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{req.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Event: <span className="font-medium text-gray-800 dark:text-gray-200">{req.event_id ?? "N/A"}</span>
                    </p>
                  </div>
                  <div className="ml-2 text-right">
                    <div
                      className={`text-sm font-semibold ${
                        req.status === "approved"
                          ? "text-green-600 dark:text-green-400"
                          : req.status === "rejected"
                          ? "text-red-600 dark:text-red-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {formatStatus(req.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminData;
