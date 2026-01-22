import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ✅ Redirect logged-in users away from login
  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/", { replace: true });
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex">
      {/* Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-b from-indigo-900 to-purple-900 items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="text-5xl font-bold">QMO</div>
          <h1 className="text-2xl font-semibold">Manila Events Admin Panel</h1>
          <p className="opacity-80">
            Secure access for conference administrators
          </p>
        </div>
      </div>

      {/* Login */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-2 rounded-md transition"
          >
            {submitting ? "Signing in..." : "Login"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Access restricted to authorized administrators only.
          </p>
        </form>
      </div>
    </div>
  );
}
