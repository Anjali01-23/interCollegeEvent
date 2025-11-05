import React, { useEffect, useState } from "react";
import { getRegistrations, handleRegistration } from "../../../api/api";

const NewRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchRegistrations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getRegistrations();
        if (!mounted) return;
        const pending = (res.data || []).filter((r) => r.status === "pending");
        setRequests(pending);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load requests. Try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchRegistrations();
    return () => {
      mounted = false;
    };
  }, []);

  const updateStatus = async (id, status) => {
    const confirmed = window.confirm(`Are you sure you want to mark this request as "${status}"?`);
    if (!confirmed) return;

    // optimistic UI update
    const prev = requests;
    setRequests((p) => p.filter((r) => r.id !== id));
    setProcessingId(id);

    try {
      await handleRegistration(id, status);
      alert(`Request ${status}`);
    } catch (err) {
      console.error(err);
      alert("Action failed. Reverting changes.");
      setRequests(prev); // rollback
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <p className="text-gray-400">Loading requests…</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  if (requests.length === 0) {
    return <p className="text-gray-400">No new requests</p>;
  }

  return (
    <div className="space-y-4 text-gray-100">
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="min-w-full bg-gray-800 border rounded-lg overflow-hidden border-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-200">Name</th>
              <th className="p-3 text-left text-sm font-medium text-gray-200">Email</th>
              <th className="p-3 text-left text-sm font-medium text-gray-200">Event ID</th>
              <th className="p-3 text-left text-sm font-medium text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-t last:border-b border-gray-700">
                <td className="p-3 text-sm text-gray-100">{req.name}</td>
                <td className="p-3 text-sm text-gray-300">{req.email}</td>
                <td className="p-3 text-sm text-gray-300">{req.event_id}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(req.id, "accepted")}
                      disabled={processingId === req.id}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-60"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, "rejected")}
                      disabled={processingId === req.id}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {requests.map((req) => (
          <div key={req.id} className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-100">{req.name}</p>
                <p className="text-sm text-gray-300">{req.email}</p>
                <p className="text-sm text-gray-300 mt-1">Event: <span className="font-medium text-gray-200">{req.event_id}</span></p>
              </div>

              <div className="ml-2 flex-shrink-0 flex flex-col gap-2">
                <button
                  onClick={() => updateStatus(req.id, "accepted")}
                  disabled={processingId === req.id}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-60"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(req.id, "rejected")}
                  disabled={processingId === req.id}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewRequest;
