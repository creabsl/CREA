import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

export default function ForgotPassword() {
  usePageTitle("CREA • Forgot password");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // Mock: mark as sent
    setSent(true);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-[var(--primary)]">
          Forgot password
        </h1>
        {sent ? (
          <div className="mt-3 rounded border bg-green-50 p-3 text-green-700 text-sm">
            If an account exists for {email}, a reset link has been sent
            (mock).
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mt-1">
              Enter your email and we'll send a reset link (mock).
            </p>
            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button type="submit">Send reset link</Button>
            </form>
          </>
        )}
        <div className="mt-3 text-sm text-gray-600">
          <Link className="text-[var(--primary)] underline" to="/login">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
