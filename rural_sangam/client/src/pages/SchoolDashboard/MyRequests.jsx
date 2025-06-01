import { useEffect, useState } from "react";
import axios from "axios";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/school/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📋 My Requests</h1>
      <div className="grid gap-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold">{req.title}</h2>
            <p className="text-sm text-gray-600">Subject: {req.subject}</p>
            <p className="text-sm">
              Status: <span className="font-medium">{req.status}</span>
            </p>
            <p className="text-sm">
              Volunteers Accepted: {req.acceptedVolunteers}
            </p>
            <p className="text-sm">
              Collaboration Room:{" "}
              <span
                className={
                  req.isCollaborationOpen ? "text-green-600" : "text-red-500"
                }
              >
                {req.isCollaborationOpen ? "Open" : "Closed"}
              </span>
            </p>
            <div className="mt-2 space-x-2">
              <button className="text-blue-600 underline">View Details</button>
              {req.isCollaborationOpen && (
                <button className="text-green-600 underline">Join Room</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
