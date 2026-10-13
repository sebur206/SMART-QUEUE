import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TextBox from "../../components/ui/TextBox.jsx";
import Button from "../../components/ui/Button.jsx";

const PatientLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Patient sign-in submitted", { email, password });
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-900">
            {/* Left Section — branding */}
            <div className="hidden md:flex relative w-full items-center justify-center p-10 overflow-hidden bg-slate-800">
                <div className="relative max-w-sm text-center">
                    <h1 className="text-4xl font-semibold mb-4 text-white">
                        Meridian Health
                    </h1>
                    <h2 className="text-lg font-medium mb-2 text-slate-200">
                        Your care, always within reach.
                    </h2>
                    <p className="text-sm text-slate-400">
                        View appointments, test results, and messages from your care team —
                        securely, from anywhere.
                    </p>
                </div>
            </div>

            {/* Right Section — login form */}
            <div className="w-full bg-slate-50 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-sm">
                    <div className="mb-6 text-center">
                        <p className="text-sm text-slate-500 font-medium">Meridian Health · Patient Portal</p>
                        <h2 className="text-2xl font-bold text-slate-800 mt-1">Sign in to continue</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <TextBox
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div>
                            <TextBox
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="flex justify-end mt-1">
                                <Link
                                    to="/auth/patient/forgot-password"
                                    className="text-xs text-slate-600 hover:text-slate-900 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            label="Sign In"
                            className="w-full bg-slate-800 text-white text-sm hover:bg-slate-900 transition-colors py-2.5 mt-2"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientLogin;