import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TextBox from "../../components/ui/TextBox.jsx";
import Button from "../../components/ui/Button.jsx";

const ForgotPassword = ({ role: initialRole }) => {
    const location = useLocation();
    const isStaff = initialRole === 'staff' || location.pathname.includes('/staff');
    const role = isStaff ? 'staff' : 'patient';
    const loginPath = isStaff ? '/auth/staff/login' : '/auth/patient/login';
    const portalName = isStaff ? 'Staff Portal' : 'Patient Portal';
    const backText = isStaff ? 'Back to Staff Sign In' : 'Back to Sign In';

    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Password reset requested for (${role}):`, email);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center">

            <div className="w-full bg-slate-50 flex items-center justify-center p-6 sm:p-10">
                <div className=" w-80">
                    <div className="mb-6 text-center">
                        <p className="text-sm text-slate-500 font-medium">Meridian Health · {portalName}</p>
                        <h2 className="text-2xl font-bold text-slate-800 mt-1">Forgot Password</h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Enter your email address and we'll send you instructions to reset your password.
                        </p>
                    </div>

                    {submitted ? (
                        <div className="flex flex-col gap-4 text-center">
                            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded">
                                If an account exists for <span className="font-semibold">{email}</span>, you will receive password reset instructions.
                            </div>
                            <Link
                                to={loginPath}
                                className="text-sm text-slate-600 hover:text-slate-900 underline mt-2"
                            >
                                {backText}
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
                            <TextBox
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <Button
                                type="submit"
                                label="Send Reset Link"
                                className="w-full bg-slate-800 text-white text-sm hover:bg-slate-900 transition-colors py-1.5 mt-2"
                            />

                            <div className="text-center mt-2 flex flex-col gap-1 text-xs text-slate-600">
                                <div>
                                    Remember your password?{' '}
                                    <Link to={loginPath} className="text-slate-800 font-medium hover:underline">
                                        {backText}
                                    </Link>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
