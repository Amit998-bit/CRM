import React, { useEffect, useState } from "react";
import axios from "axios";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get("http://localhost:9000/get-leads");
        setLeads(response.data);
      } catch (err) {
        setError("Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  if (loading) return <p className="text-center">Loading leads...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Leads</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Contact</th>
              <th className="border px-4 py-2">Progress</th>
              <th className="border px-4 py-2">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{lead.name}</td>
                <td className="border px-4 py-2">{lead.email}</td>
                <td className="border px-4 py-2">{lead.contact}</td>
                <td className="border px-4 py-2">{lead.progress}</td>
                <td className="border px-4 py-2">{lead.assignedTo?.name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leads;