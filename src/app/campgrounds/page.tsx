"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCampgrounds } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface Campground {
  _id: string;
  name: string;
  address: string;
  telephone: string;
  description?: string;
}

const DUMMY_CAMPGROUNDS: Campground[] = [
  {
    _id: "1",
    name: "Pine Ridge Campground",
    address: "123 Forest Rd, Chiang Mai 50000",
    telephone: "053-123-456",
    description:
      "Nestled among towering pines with stunning mountain views and fresh air.",
  },
  {
    _id: "2",
    name: "Riverside Haven",
    address: "88 River Lane, Kanchanaburi 71000",
    telephone: "034-567-890",
    description:
      "Wake up to the sound of the river — perfect for kayaking and fishing.",
  },
  {
    _id: "3",
    name: "Sunset Valley Camp",
    address: "45 Valley Rd, Pai 58130",
    telephone: "053-987-654",
    description:
      "Golden sunsets and starry nights in the heart of Mae Hong Son.",
  },
  {
    _id: "4",
    name: "Lakeside Retreat",
    address: "10 Lakefront Dr, Khao Yai 30130",
    telephone: "044-111-222",
    description:
      "Peaceful lakeside setting inside a national park — wildlife all around.",
  },
  {
    _id: "5",
    name: "Summit Base Camp",
    address: "99 Peak Trail, Doi Inthanon 50180",
    telephone: "053-456-789",
    description:
      "Base camp for hikers — high altitude, cool breezes, breathtaking views.",
  },
  {
    _id: "6",
    name: "Beach Palms Camp",
    address: "77 Coastal Path, Krabi 81000",
    telephone: "075-321-654",
    description:
      "Fall asleep to ocean waves under swaying palms on the Andaman coast.",
  },
];

export default function CampgroundsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [campgrounds, setCampgrounds] = useState<Campground[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getCampgrounds()
      .then((d) => {
        console.log("[getCampgrounds] response:", d);
        setCampgrounds(d.data || []);
      })
      .catch((err) => {
        console.error("[getCampgrounds] failed:", err);
        setCampgrounds(DUMMY_CAMPGROUNDS);
      })
      .finally(() => setFetching(false));
  }, []);

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400 text-sm animate-pulse">Loading campgrounds...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Campgrounds</h1>
        <p className="text-gray-500 mt-1">Find your perfect outdoor escape</p>
      </div>

      {campgrounds.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No campgrounds available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campgrounds.map((camp) => (
            <div
              key={camp._id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 h-36 flex items-center justify-center">
                <span className="text-5xl">🏕️</span>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-900">{camp.name}</h2>
                <p className="text-sm text-gray-500 mt-1 flex items-start gap-1">
                  <span className="mt-0.5">📍</span>
                  {camp.address}
                </p>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <span>📞</span>
                  {camp.telephone}
                </p>
                {camp.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{camp.description}</p>
                )}
                <button
                  onClick={() => {
                    if (!user) {
                      router.push("/login");
                    } else {
                      router.push(
                        `/bookings/new?campgroundId=${camp._id}&campgroundName=${encodeURIComponent(camp.name)}`,
                      );
                    }
                  }}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
