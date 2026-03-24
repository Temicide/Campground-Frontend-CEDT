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
    <nav>
      <div>
        <Link href="/campgrounds">
          ⛺ CampBook
        </Link>

        <div>
          {!user ? (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          ) : (
            <>
              <span>
                Hi, <span>{user.name}</span>
                {user.role === "admin" && (
                  <span>Admin</span>
                )}
              </span>
              {user.role === "admin" ? (
                <Link href="/admin/bookings">All Bookings</Link>
              ) : (
                <Link href="/bookings">My Bookings</Link>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
