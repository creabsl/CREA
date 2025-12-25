import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

const API_URL = (
  import.meta.env?.VITE_API_URL || "https://api.crea.org.in"
).replace(/\/+$|\/api$/i, "");

export default function ForgotPassword() {
  usePageTitle("CREA • Forgot password");
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: email, 2: OTP, 3: password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!email.trim()) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/send-password-reset-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setSuccessMessage("OTP sent to your email. Please check your inbox.");
      setStep(2);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send OTP. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!otp.trim()) {
      setError("Please enter the OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/verify-password-reset-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: otp }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      setSuccessMessage("OTP verified successfully. Enter your new password.");
      setStep(3);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to verify OTP. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!newPassword.trim()) {
      setError("Please enter your new password");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reset password. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-[var(--primary)]">
          Reset Password
        </h1>

        {step === 1 && (
          <>
            <p className="text-sm text-gray-600 mt-1">
              Enter your email address and we'll send you an OTP to verify.
            </p>
            <form className="mt-4 space-y-3" onSubmit={sendOtp}>
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
              {error && <div className="text-sm text-red-600">{error}</div>}
              {successMessage && (
                <div className="text-sm text-green-600">{successMessage}</div>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-gray-600 mt-1">
              Enter the OTP sent to {email}
            </p>
            <form className="mt-4 space-y-3" onSubmit={verifyOtp}>
              <Input
                label="OTP"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
              {error && <div className="text-sm text-red-600">{error}</div>}
              {successMessage && (
                <div className="text-sm text-green-600">{successMessage}</div>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-[var(--primary)] underline"
              >
                Back to email
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-sm text-gray-600 mt-1">
              Enter your new password
            </p>
            <form className="mt-4 space-y-3" onSubmit={resetPassword}>
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
              {error && <div className="text-sm text-red-600">{error}</div>}
              {successMessage && (
                <div className="text-sm text-green-600">{successMessage}</div>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep(2);
                  setError("");
                  setSuccessMessage("");
                }}
                className="text-sm text-[var(--primary)] underline"
              >
                Back to OTP
              </button>
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
