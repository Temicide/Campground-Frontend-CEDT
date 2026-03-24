"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBooking } from "@/lib/api";

function CreateBookingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const campgroundId = params.get("campgroundId") || "";
  const campgroundName = params.get("campgroundName") || "Selected Campground";

  const today = new Date().toISOString().split("T")[0];
  const [checkInDate, setCheckInDate] = useState("");
  const [nights, setNights] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!checkInDate) return "Check-in date is required.";
    if (checkInDate < today) return "Check-in date must not be in the past.";
    if (nights < 1 || nights > 3) return "Number of nights must be between 1 and 3.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      await createBooking({ campground: campgroundId, checkInDate, nights });
      router.push("/bookings");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => router.back()}>← Back</button>
        <h1>Create Booking</h1>
        <p>Complete your reservation</p>
      </div>

      {error && <div>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Campground</label>
          <div>🏕️ {campgroundName}</div>
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

        <button type="submit" disabled={loading}>
          {loading ? "Confirming..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}

export default function CreateBookingPage() {
  return (
    <Suspense>
      <CreateBookingForm />
    </Suspense>
  );
}
