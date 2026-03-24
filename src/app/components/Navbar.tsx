"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/campgrounds" className="text-xl font-bold text-green-700 tracking-tight">
          ⛺ CampBook
        </Link>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-500">
                Hi, <span className="font-semibold text-gray-800">{user.name}</span>
                {user.role === "admin" && (
                  <span className="ml-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                    Admin
                  </span>
                )}
              </span>
              {user.role === "admin" ? (
                <Link
                  href="/admin/bookings"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  All Bookings
                </Link>
              ) : (
                <Link
                  href="/bookings"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  My Bookings
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
