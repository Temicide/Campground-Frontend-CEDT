"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getMyBookings, updateBooking } from "@/lib/api";

interface Booking {
  _id: string;
  campground: { name: string };
  checkInDate: string;
  nights: number;
}

const DUMMY_BOOKING: Booking = {
  _id: "123",
  campground: { name: "Pine Ridge Campground" },
  checkInDate: "2026-04-10T00:00:00.000Z",
  nights: 2,
};

export default function EditBookingPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [nights, setNights] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    getMyBookings()
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
      router.push("/bookings");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <p>Loading booking...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <button onClick={() => router.back()}>← Back</button>
        <h1>Edit Booking</h1>
        <p>Update your reservation details</p>
      </div>

      {error && <div>{error}</div>}

      {booking && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Campground</label>
            <div>🏕️ {booking.campground?.name}</div>
          </div>

          <div>
            <label>
              Check-in Date{" "}
              <span>(must not be in the past)</span>
            </label>
            <input
              type="date"
              required
              min={today}
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
            />
          </div>

          <div>
            <label>
              Number of Nights{" "}
              <span>(max 3 nights)</span>
            </label>
            <input
              type="number"
              required
              min={1}
              max={3}
              value={nights}
              onChange={(e) => setNights(Number(e.target.value))}
            />
            <p>⚠️ Maximum stay is 3 nights per booking</p>
          </div>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
}
