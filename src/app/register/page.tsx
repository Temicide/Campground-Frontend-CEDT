"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", telephone: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <span>⛺</span>
        <h1>Create an account</h1>
        <p>Start booking your campground today</p>
      </div>

      {error && <div>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            required
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>

        <div>
          <label>Telephone</label>
          <input
            type="tel"
            required
            placeholder="0812345678"
            value={form.telephone}
            onChange={(e) => set("telephone", e.target.value)}
          />
        </div>

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
          <label>
            Password{" "}
            <span>(min 6 characters)</span>
          </label>
          <input
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link href="/login">Login</Link>
      </p>
    </div>
  );
}
