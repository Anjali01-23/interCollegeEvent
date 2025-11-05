import React, { useEffect, useState } from "react";
import { getRegistrations } from "../../../api/api";

/**
 * AllRequest — responsive + feature-upgraded version (dark mode)
 */

const AllRequest = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRegistrations();
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
    const text = `${req.name || ""} ${req.email || ""} ${req.event_id || ""}`.toLowerCase();
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
    a.download = `registrations_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 text-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">All Requests</h2>
          <p className="text-sm text-gray-400">View and filter all registration requests</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search name / email / event id"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-md w-60 text-sm bg-gray-900 border-gray-700 text-gray-100"
          />

          <select
            className="border px-3 py-2 rounded-md text-sm bg-gray-900 border-gray-700 text-gray-100"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:opacity-90"
            title="Export visible rows to CSV"
          >
            Export Data
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg bg-gray-800 p-6 text-center text-gray-400">Loading requests…</div>
      ) : error ? (
        <div className="rounded-lg bg-red-800 border border-red-700 p-4 text-red-200">{error}</div>
      ) : filteredRequests.length === 0 ? (
        <div className="rounded-lg bg-gray-800 p-6 text-center text-gray-400">No requests found</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-gray-800 rounded-lg shadow overflow-auto border border-gray-700">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-900 text-left text-sm text-gray-200">
                <tr>
                  <th className="p-3 border-b border-gray-700">ID</th>
                  <th className="p-3 border-b border-gray-700">Name</th>
                  <th className="p-3 border-b border-gray-700">Email</th>
                  <th className="p-3 border-b border-gray-700">Event ID</th>
                  <th className="p-3 border-b border-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-900">
                    <td className="p-3 text-sm border-b border-gray-700 text-gray-100">{req.id}</td>
                    <td className="p-3 text-sm border-b border-gray-700 text-gray-100">{req.name}</td>
                    <td className="p-3 text-sm border-b border-gray-700 text-gray-300">{req.email}</td>
                    <td className="p-3 text-sm border-b border-gray-700 text-gray-300">{req.event_id ?? "N/A"}</td>
                    <td
                      className={`p-3 text-sm border-b border-gray-700 font-semibold ${
                        req.status === "accepted" ? "text-green-400" : req.status === "rejected" ? "text-red-400" : "text-yellow-400"
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
              <div key={req.id} className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-100 truncate">{req.name}</p>
                    <p className="text-sm text-gray-400 truncate">{req.email}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Event: <span className="font-medium text-gray-200">{req.event_id ?? "N/A"}</span>
                    </p>
                  </div>
                  <div className="ml-2 text-right">
                    <div
                      className={`text-sm font-semibold ${
                        req.status === "accepted" ? "text-green-400" : req.status === "rejected" ? "text-red-400" : "text-yellow-400"
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

export default AllRequest;
