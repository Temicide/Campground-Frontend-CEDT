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
    description: "Nestled among towering pines with stunning mountain views and fresh air.",
  },
  {
    _id: "2",
    name: "Riverside Haven",
    address: "88 River Lane, Kanchanaburi 71000",
    telephone: "034-567-890",
    description: "Wake up to the sound of the river — perfect for kayaking and fishing.",
  },
  {
    _id: "3",
    name: "Sunset Valley Camp",
    address: "45 Valley Rd, Pai 58130",
    telephone: "053-987-654",
    description: "Golden sunsets and starry nights in the heart of Mae Hong Son.",
  },
  {
    _id: "4",
    name: "Lakeside Retreat",
    address: "10 Lakefront Dr, Khao Yai 30130",
    telephone: "044-111-222",
    description: "Peaceful lakeside setting inside a national park — wildlife all around.",
  },
  {
    _id: "5",
    name: "Summit Base Camp",
    address: "99 Peak Trail, Doi Inthanon 50180",
    telephone: "053-456-789",
    description: "Base camp for hikers — high altitude, cool breezes, breathtaking views.",
  },
  {
    _id: "6",
    name: "Beach Palms Camp",
    address: "77 Coastal Path, Krabi 81000",
    telephone: "075-321-654",
    description: "Fall asleep to ocean waves under swaying palms on the Andaman coast.",
  },
];

export default function CampgroundsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [campgrounds, setCampgrounds] = useState<Campground[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getCampgrounds()
      .then((d) => setCampgrounds(d.data || []))
      .catch(() => setCampgrounds(DUMMY_CAMPGROUNDS))
      .finally(() => setFetching(false));
  }, []);

  if (loading || fetching) {
    return (
      <div>
        <p>Loading campgrounds...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1>Campgrounds</h1>
        <p>Find your perfect outdoor escape</p>
      </div>

      {campgrounds.length === 0 ? (
        <p>No campgrounds available.</p>
      ) : (
        <div>
          {campgrounds.map((camp) => (
            <div key={camp._id}>
              <div>
                <span>🏕️</span>
              </div>
              <div>
                <h2>{camp.name}</h2>
                <p>
                  <span>📍</span>
                  {camp.address}
                </p>
                <p>
                  <span>📞</span>
                  {camp.telephone}
                </p>
                {camp.description && (
                  <p>{camp.description}</p>
                )}
                <button
                  onClick={() => {
                    if (!user) {
                      router.push("/login");
                    } else {
                      router.push(`/bookings/new?campgroundId=${camp._id}&campgroundName=${encodeURIComponent(camp.name)}`);
                    }
                  }}
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
