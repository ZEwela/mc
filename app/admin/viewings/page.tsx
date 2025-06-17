"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ArrowLeft,
  CalendarDays,
  RefreshCw,
  Mail,
  Phone,
  User,
  Home,
} from "lucide-react";

type Viewing = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  property_id?: string;
  message?: string;
  preferred_date?: string;
  created_at: string;
};

export default function AdminViewingsPage() {
  const [viewings, setViewings] = useState<Viewing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchViewings();
  }, []);

  async function fetchViewings() {
    setLoading(true);
    const { data, error } = await supabase
      .from("request_viewings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setViewings(data || []);
    }
    setLoading(false);
  }

  async function deleteViewing(id: string) {
    if (!confirm("Are you sure you want to delete this viewing request?"))
      return;

    const { error } = await supabase
      .from("request_viewings")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete request.");
    } else {
      fetchViewings();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <p className="text-lg text-gray-600">Loading viewing requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin")}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-blue-600" />
              Viewing Requests
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
            Error: {error}
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Preferred Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {viewings.map((viewing) => (
                <tr key={viewing.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {viewing.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {viewing.email}
                    </div>
                    {viewing.phone && (
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {viewing.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {viewing.preferred_date
                      ? new Date(viewing.preferred_date).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {viewing.message || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(viewing.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {viewing.property_id && (
                        <button
                          title="View Property"
                          onClick={() =>
                            router.push(`/properties/${viewing.property_id}`)
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Home className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteViewing(viewing.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {viewings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <CalendarDays className="mx-auto h-10 w-10 mb-2 text-gray-400" />
              No viewing requests yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
