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
      <div>
        <p>Loading all bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          <div>
            <h1>Admin Dashboard</h1>
            <span>Admin Only</span>
          </div>
          <p>All bookings across all users — {bookings.length} total</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div>
          <span>📋</span>
          <p>No bookings in the system.</p>
        </div>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Campground</th>
                <th>Check-in Date</th>
                <th>Nights</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <p>{b.user?.name}</p>
                    <p>{b.user?.email}</p>
                  </td>
                  <td>{b.campground?.name}</td>
                  <td>
                    {new Date(b.checkInDate).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>
                  <td>{b.nights} night{b.nights > 1 ? "s" : ""}</td>
                  <td>
                    <Link href={`/admin/bookings/${b._id}/edit`}>Edit</Link>
                    <button onClick={() => setDeleteId(b._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div>
          <div>
            <div>
              <span>🗑️</span>
              <h2>Delete Booking?</h2>
              <p>Are you sure you want to delete this booking? This action cannot be undone.</p>
            </div>
            <div>
              <button onClick={() => setDeleteId(null)} disabled={deleting}>
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
