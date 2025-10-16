import React, { useEffect, useState } from "react";
import axios from "axios";
import { getRegistrations, handleRegistration } from "../../../api/api";

const NewRequest = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await getRegistrations();
        const pending = res.data.filter(r => r.status === "pending");
        setRequests(pending);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRegistrations();
  }, []);

  const updateStatus = async (id, status) => {
    await handleRegistration(id,status);
    alert(`Request is ${status}`);
    setRequests(prev => prev.filter(r => r.id !== id)); // remove after approval/rejection
  };

  return (
    <div>
      {requests.length === 0 ? (
        <p>No new requests</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Event ID</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td className="p-2 border">{req.name}</td>
                <td className="p-2 border">{req.email}</td>
                <td className="p-2 border">{req.event_id}</td>
                <td className="p-2 border">
                  <button
                    className="bg-green-500 text-white px-4  py-1 mr-3 text-lg rounded"
                    onClick={() => updateStatus(req.id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-1 text-lg rounded"
                    onClick={() => updateStatus(req.id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NewRequest;
