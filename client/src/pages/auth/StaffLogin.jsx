import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TextBox from "../../components/ui/TextBox.jsx";
import Button from "../../components/ui/Button.jsx";

const StaffLogin = () => {
    const [staffId, setStaffId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setError("");
        setIsSubmitting(true);

        try {
            // TODO: replace with real authentication, e.g.
            // await authService.signIn({ staffId: staffId.trim(), password });
            // then navigate to the staff dashboard.
            await new Promise((resolve) => setTimeout(resolve, 500)); // placeholder
        } catch (err) {
            setError("Sign in failed. Check your Staff ID and password and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-900">
            {/* Left Section — branding */}
            <div className="hidden md:flex relative w-full items-center justify-center p-10 overflow-hidden bg-slate-800">
                <div className="relative max-w-sm text-center">
                    <h1 className="text-4xl font-semibold mb-4 text-white">Meridian Health</h1>
                    <h2 className="text-lg font-medium mb-2 text-slate-200">
                        Every shift starts with a secure sign in.
                    </h2>
                    <p className="text-sm text-slate-400">
                        Access schedules, queues, and more — all in one place.
                    </p>
                </div>
            </div>

            {/* Right Section — login form */}
            <div className="w-full bg-slate-50 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-sm">
                    <div className="mb-6 text-center">
                        <p className="text-sm text-slate-500 font-medium">Meridian Health · Staff Portal</p>
                        <h2 className="text-2xl font-bold text-slate-800 mt-1">Sign in to continue</h2>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            aria-live="assertive"
                            className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate={false}>
                        <TextBox
                            label="Staff ID"
                            name="staffId"
                            placeholder="Enter your Staff ID"
                            autoComplete="username"
                            autoFocus
                            value={staffId}
                            onChange={(e) => setStaffId(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                        <div>
                            <TextBox
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                            <div className="flex justify-end mt-1">
                                <Link
                                    to="/auth/staff/forgot-password"
                                    className="text-xs text-slate-600 hover:text-slate-900 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            label={isSubmitting ? "Signing in…" : "Sign In"}
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                            className="w-full bg-slate-800 text-white text-sm hover:bg-slate-900 transition-colors py-1.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StaffLogin;