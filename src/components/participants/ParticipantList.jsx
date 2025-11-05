import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getAcceptedParticipants } from "../../../api/api";

const ParticipantList = () => {
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch participants
  useEffect(() => {
    let mounted = true;
    const fetchParticipants = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAcceptedParticipants();
        if (!mounted) return;
        setParticipants(res.data || []);
      } catch (err) {
        console.error("Failed to fetch participants", err);
        if (mounted) setError("Failed to load participants");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchParticipants();
    return () => {
      mounted = false;
    };
  }, []);

  // debounce search input to avoid rapid re-filtering
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // defensive filter
  const filteredParticipants = participants.filter((p) => {
    const eventName = (p.event_name || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    const q = debouncedSearch;
    if (!q) return true;
    return eventName.includes(q) || name.includes(q) || email.includes(q);
  });

  return (
    <div className="pt-0 px-4 sm:px-6 lg:px-8 text-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-100">Participants List</h2>

        {/* Search */}
        <div className="relative mb-4 max-w-full">
          <input
            type="text"
            placeholder="Search by event name, participant name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-900 text-gray-100"
            aria-label="Search participants"
          />
          <Search size={18} className="absolute top-2.5 left-3 text-gray-400" />
        </div>

        {/* States */}
        {loading ? (
          <div className="rounded-lg bg-gray-800 p-6 text-center text-gray-400">Loading participants…</div>
        ) : error ? (
          <div className="rounded-lg bg-red-800 border border-red-700 p-4 text-red-200">{error}</div>
        ) : filteredParticipants.length === 0 ? (
          <div className="rounded-lg bg-gray-800 p-6 text-center text-gray-400">No participants found</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-gray-800 rounded-lg shadow overflow-auto border border-gray-700">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-900 text-left text-sm text-gray-200">
                  <tr>
                    <th className="p-3 border-b border-gray-700">Name</th>
                    <th className="p-3 border-b border-gray-700">Email</th>
                    <th className="p-3 border-b border-gray-700">Event</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((p) => (
                    <tr key={p.id ?? `${p.event_id}_${p.email}`} className="hover:bg-gray-900">
                      <td className="p-3 text-sm border-b border-gray-700 text-gray-100">{p.name ?? "-"}</td>
                      <td className="p-3 text-sm border-b border-gray-700 text-gray-300">{p.email ?? "-"}</td>
                      <td className="p-3 text-sm border-b border-gray-700 text-gray-300">{p.event_name ?? p.event_title ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filteredParticipants.map((p) => (
                <div key={p.id ?? `${p.event_id}_${p.email}`} className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-100 truncate">{p.name ?? "Unknown"}</p>
                      <p className="text-sm text-gray-300 truncate">{p.email ?? "-"}</p>
                      <p className="text-sm text-gray-300 mt-1">
                        Event: <span className="font-medium text-gray-200">{p.event_name ?? p.event_title ?? "N/A"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ParticipantList;
