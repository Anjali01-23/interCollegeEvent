import axios from "axios";
import { useEffect, useState } from "react";
import { getAcceptedParticipants } from "../../../api/api";
import { Search} from "lucide-react";


const ParticipantList = () => {
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState("");
  

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await getAcceptedParticipants();
        setParticipants(res.data);
      } catch (err) {
        console.error("Failed to fetch participants", err);
      }
    };

    fetchParticipants();
  }, []);

  // Filter participants based on search query
  const filteredParticipants = participants.filter((p) =>
    p.event_name.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="pt-0 px-4">
    <h2 className="text-lg font-semibold mb-3 ">Participants List</h2>

    {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search by event name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search size={18} className="absolute top-2.5 left-3 text-gray-500" />
            </div>
 
    {/* Table */}
    {filteredParticipants.length === 0 ? (
        <p>No Participants found</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Event Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.map((req) => (
              <tr key={req.id}>
                <td className="p-2 border">{req.name}</td>
                <td className="p-2 border">{req.email}</td>
                <td className="p-2 border">{req.event_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
     </div>

  );
};

export default ParticipantList;
