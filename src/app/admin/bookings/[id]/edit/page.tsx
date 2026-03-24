"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAllBookings, updateBooking } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface Booking {
  _id: string;
  campground: { name: string };
  user: { name: string };
  checkInDate: string;
  nights: number;
}

const DUMMY_BOOKING: Booking = {
  _id: "123",
  campground: { name: "Pine Ridge Campground" },
  user: { name: "Alice Smith" },
  checkInDate: "2026-04-10T00:00:00.000Z",
  nights: 2,
};

export default function AdminEditBookingPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { user: authUser, loading: authLoading } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [nights, setNights] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    getAllBookings()
      .then((d) => {
        const found = (d.data || []).find((b: Booking) => b._id === id);
        const b = found || DUMMY_BOOKING;
        setBooking(b);
        setCheckInDate(b.checkInDate.split("T")[0]);
        setNights(b.nights);
      })
      .catch(() => {
        setBooking(DUMMY_BOOKING);
        setCheckInDate(DUMMY_BOOKING.checkInDate.split("T")[0]);
        setNights(DUMMY_BOOKING.nights);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkInDate < today) { setError("Check-in date must not be in the past."); return; }
    if (nights < 1 || nights > 3) { setError("Nights must be between 1 and 3."); return; }
    setError("");
    setSaving(true);
    try {
      await updateBooking(id, { checkInDate, nights });
      router.push("/admin/bookings");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400 text-sm animate-pulse">Loading booking...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8 border border-gray-100">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Edit Booking</h1>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
              Admin
            </span>
          </div>
          {booking && (
            <p className="text-sm text-gray-500">
              Booking by <span className="font-medium text-gray-700">{booking.user?.name}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {booking && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campground</label>
              <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 font-medium">
                🏕️ {booking.campground?.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date{" "}
                <span className="text-xs text-gray-400 font-normal">(must not be in the past)</span>
              </label>
              <input
                type="date"
                required
                min={today}
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Nights{" "}
                <span className="text-xs text-gray-400 font-normal">(max 3 nights)</span>
              </label>
              <input
                type="number"
                required
                min={1}
                max={3}
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-xs text-amber-600 mt-1">⚠️ Maximum stay is 3 nights per booking</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
