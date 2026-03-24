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
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8 border border-gray-100">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create Booking</h1>
          <p className="text-sm text-gray-500 mt-1">Complete your reservation</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campground</label>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 font-medium">
              🏕️ {campgroundName}
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-amber-600 mt-1">⚠️ Maximum stay is 3 nights per booking</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Confirming..." : "Confirm Booking"}
          </button>
        </form>
      </div>
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
