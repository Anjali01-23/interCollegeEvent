// src/pages/SuperAdmin.jsx
import React, { useEffect, useState } from "react";
import { Trash2, Check, X, Search } from "lucide-react";
import {
  getAdminRequests,
  approveAdminRequest,
  rejectAdminRequest,
} from "../../../api/api"; // see api helpers below

export default function NewReq() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error("Failed to load admin requests", err);
      setError("Failed to load requests. Check server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (r) => {
    
    if (!window.confirm(`Approve ${r.email} as ${r.requested_role}?`)) return;
    setProcessingId(r.id);
    // optimistic UI - remove request immediately
    const prev = [...requests];
    setRequests((p) => p.filter((x) => x.id !== r.id));
    try {
      await approveAdminRequest(r.id);
      alert("Approved!!")
    } catch (err) {
      console.error("Approve failed", err);
      setRequests(prev); // rollback
      alert("Approve failed. See console.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (r) => {
    if (!window.confirm(`Reject admin request from ${r.email}?`)) return;
    setProcessingId(r.id);
    const prev = [...requests];
    setRequests((p) => p.filter((x) => x.id !== r.id));
    try {
      await rejectAdminRequest(r.id);
      alert("Rejected!!")
    } catch (err) {
      console.error("Reject failed", err);
      setRequests(prev);
      alert("Reject failed. See console.");
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = requests.filter((r) => {
    if (!query) return true;
    const q = query.trim().toLowerCase();
    return (
      (r.email || "").toLowerCase().includes(q) ||
      (r.college || "").toLowerCase().includes(q) ||
      (r.requested_role || "").toLowerCase().includes(q) ||
      (r.message || "").toLowerCase().includes(q) ||
      (r.name || "").toLowerCase().includes(q)
    );
  });

  return (
  

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 text-gray-100 ">
        <div className="flex items-center justify-between mb-6">


          <div className="flex items-center gap-2 ">
            <div className="relative">
              <input
                type="text"
                placeholder="Search requests..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-3 py-2  rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>

            <button
              onClick={loadRequests}
              className="bg-purple-600 px-3 py-2 rounded-lg hover:bg-purple-700"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          {loading ? (
            <div className="text-gray-400 py-8 text-center">Loading requests…</div>
          ) : error ? (
            <div className="text-red-400 py-4 text-center">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-gray-400 py-8 text-center">No admin requests found</div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-gray-400 mb-2">
                Showing {filtered.length} request(s) — total {requests.length}
              </div>

              <div className="grid gap-3">
                {filtered.map((r) => (
                  <div
                    key={r.id}
                    className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-300 font-semibold truncate">{r.name || r.email}</div>
                        <div className="text-xs text-gray-500 px-2 py-0.5 bg-gray-800 rounded">{r.requested_role}</div>
                        <div className="text-xs text-gray-400 ml-2">{r.college}</div>
                        <div className="text-xs text-gray-500 ml-2">• {new Date(r.created_at || r.createdAt || r.created).toLocaleString()}</div>
                      </div>
                      <div className="text-sm text-gray-400 mt-1 truncate">{r.message || "-"}</div>
                      <div className="text-xs text-gray-500 mt-1">{r.email}</div>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(r)}
                        disabled={processingId === r.id}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                        title="Approve request"
                      >
                        <Check size={14} /> Approve
                      </button>

                      <button
                        onClick={() => handleReject(r)}
                        disabled={processingId === r.id}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                        title="Reject request"
                      >
                        <X size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
  );
}