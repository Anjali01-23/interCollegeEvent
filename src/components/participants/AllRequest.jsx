import React, { useEffect } from 'react'
import { useState } from 'react';
import { getRegistrations } from '../../../api/api';


const AllRequest = () => {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("All"); // New state for filtering

    useEffect(()=>{
      const fetchRegistrations = async () => {
            try {
              const res = await getRegistrations();
              setRequests(res.data);
            } catch (err) {
              console.error(err);
            }
          };
          fetchRegistrations();
    },[]);


    // 🔍 Filter logic
    const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter(
          (req) => req.status.toLowerCase() === filter.toLowerCase()
        );

     // ✅ Helper to format status text
    const formatStatus = (status) =>
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">All Requests</h2>

        {/* 🔽 Filter Dropdown */}
        <select
          className="border px-3 py-2 rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

       {filteredRequests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Event ID</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id}>
                <td className="p-2 border">{req.name}</td>
                <td className="p-2 border">{req.email}</td>
                <td className="p-2 border">{req.event_id}</td>
                <td className={`p-2 border ${
    req.status === "accepted"
      ? "text-green-600 font-semibold"
      : req.status === "rejected"
      ? "text-red-600 font-semibold"
      : "text-yellow-600 font-semibold"
  }`}>{formatStatus(req.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllRequest;