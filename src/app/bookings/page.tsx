"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyBookings, deleteBooking } from "@/lib/api";

interface Booking {
  _id: string;
  campground: { _id: string; name: string };
  checkInDate: string;
  nights: number;
}

const DUMMY_BOOKINGS: Booking[] = [
  { _id: "1", campground: { _id: "1", name: "Pine Ridge Campground" }, checkInDate: "2026-04-10T00:00:00.000Z", nights: 2 },
  { _id: "2", campground: { _id: "2", name: "Riverside Haven" }, checkInDate: "2026-05-03T00:00:00.000Z", nights: 1 },
  { _id: "3", campground: { _id: "3", name: "Sunset Valley Camp" }, checkInDate: "2026-06-15T00:00:00.000Z", nights: 3 },
];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBookings = () => {
    setLoading(true);
    getMyBookings()
      .then((d) => setBookings(d.data || []))
      .catch(() => setBookings(DUMMY_BOOKINGS))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

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
        <p>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          <h1>My Bookings</h1>
          <p>Manage your upcoming trips</p>
        </div>
        <Link href="/campgrounds">+ New Booking</Link>
      </div>

      {bookings.length === 0 ? (
        <div>
          <span>🏕️</span>
          <p>No bookings yet.</p>
          <Link href="/campgrounds">Browse campgrounds →</Link>
        </div>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Campground</th>
                <th>Check-in Date</th>
                <th>Nights</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.campground?.name}</td>
                  <td>
                    {new Date(b.checkInDate).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>
                  <td>{b.nights} night{b.nights > 1 ? "s" : ""}</td>
                  <td>
                    <Link href={`/bookings/${b._id}/edit`}>Edit</Link>
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
