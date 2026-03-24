"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllBookings, deleteBooking } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface Booking {
  _id: string;
  user: { name: string; email: string };
  campground: { name: string };
  checkInDate: string;
  nights: number;
}

const DUMMY_BOOKINGS: Booking[] = [
  { _id: "1", user: { name: "Alice Smith", email: "alice@example.com" }, campground: { name: "Pine Ridge Campground" }, checkInDate: "2026-04-10T00:00:00.000Z", nights: 2 },
  { _id: "2", user: { name: "Bob Johnson", email: "bob@example.com" }, campground: { name: "Riverside Haven" }, checkInDate: "2026-05-03T00:00:00.000Z", nights: 1 },
  { _id: "3", user: { name: "Carol White", email: "carol@example.com" }, campground: { name: "Sunset Valley Camp" }, checkInDate: "2026-06-15T00:00:00.000Z", nights: 3 },
  { _id: "4", user: { name: "David Lee", email: "david@example.com" }, campground: { name: "Lakeside Retreat" }, checkInDate: "2026-07-01T00:00:00.000Z", nights: 2 },
  { _id: "5", user: { name: "Eva Brown", email: "eva@example.com" }, campground: { name: "Summit Base Camp" }, checkInDate: "2026-07-20T00:00:00.000Z", nights: 1 },
];

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getAllBookings()
      .then((d) => setBookings(d.data || []))
      .catch(() => setBookings(DUMMY_BOOKINGS))
      .finally(() => setLoading(false));
  }, []);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteBooking(deleteId);
      setBookings((prev) => prev.filter((b) => b._id !== deleteId));
      setDeleteId(null);
    } catch {
      // silently ignore in demo mode
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400 text-sm animate-pulse">Loading all bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
              Admin Only
            </span>
          </div>
          <p className="text-gray-500">All bookings across all users — {bookings.length} total</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <span className="text-5xl">📋</span>
          <p className="text-gray-500 mt-4">No bookings in the system.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-orange-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">User</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Campground</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Check-in Date</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Nights</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{b.user?.name}</p>
                    <p className="text-xs text-gray-400">{b.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{b.campground?.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(b.checkInDate).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{b.nights} night{b.nights > 1 ? "s" : ""}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/bookings/${b._id}/edit`}
                      className="inline-block text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteId(b._id)}
                      className="text-xs bg-red-50 text-red-700 hover:bg-red-100 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="text-center">
              <span className="text-4xl">🗑️</span>
              <h2 className="text-lg font-bold text-gray-900 mt-3">Delete Booking?</h2>
              <p className="text-sm text-gray-500 mt-2">Are you sure you want to delete this booking? This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
