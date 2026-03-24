"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form);
      setUser(data.data);
      if (data.data?.role === "admin") {
        router.push("/admin/bookings");
      } else {
        router.push("/campgrounds");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <span>⛺</span>
        <h1>Welcome back</h1>
        <p>Login to manage your bookings</p>
      </div>

      {error && <div>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don&apos;t have an account?{" "}
        <Link href="/register">Register</Link>
      </p>
    </div>
  );
}
