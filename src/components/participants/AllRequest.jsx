import React, { useEffect, useState } from "react";
import { getRegistrations } from "../../../api/api";

/**
 * AllRequest — responsive + feature-upgraded version
 * - Table for md+ screens, stacked cards for mobile
 * - Filter by status, quick text search, refresh, export CSV
 * - Loading / error handling
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
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold">All Requests</h2>
          <p className="text-sm text-gray-500">View and filter all registration requests</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search name / email / event id"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-md w-60 text-sm"
          />

          <select
            className="border px-3 py-2 rounded-md text-sm"
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
        <div className="rounded-lg bg-white p-6 text-center text-gray-600">Loading requests…</div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">{error}</div>
      ) : filteredRequests.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center text-gray-600">No requests found</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50 text-left text-sm text-gray-700">
                <tr>
                  <th className="p-3 border-b">ID</th>
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Email</th>
                  <th className="p-3 border-b">Event ID</th>
                  <th className="p-3 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="p-3 text-sm border-b">{req.id}</td>
                    <td className="p-3 text-sm border-b">{req.name}</td>
                    <td className="p-3 text-sm border-b">{req.email}</td>
                    <td className="p-3 text-sm border-b">{req.event_id ?? "N/A"}</td>
                    <td
                      className={`p-3 text-sm border-b font-semibold ${
                        req.status === "accepted" ? "text-green-600" : req.status === "rejected" ? "text-red-600" : "text-yellow-600"
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
              <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{req.name}</p>
                    <p className="text-sm text-gray-500 truncate">{req.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Event: <span className="font-medium text-gray-700">{req.event_id ?? "N/A"}</span>
                    </p>
                  </div>
                  <div className="ml-2 text-right">
                    <div
                      className={`text-sm font-semibold ${
                        req.status === "accepted" ? "text-green-600" : req.status === "rejected" ? "text-red-600" : "text-yellow-600"
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
