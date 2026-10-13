import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import clsx from "clsx";
import AuthSplit from "../../components/layouts/AuthSplit.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuthPortal } from "./authPortal.js";

const CODE_LENGTH = 4;
const RESEND_SECONDS = 30;

const VerifyCode = ({ role }) => {
    const portal = useAuthPortal(role);
    const navigate = useNavigate();
    const email = useLocation().state?.email;

    const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendIn, setResendIn] = useState(RESEND_SECONDS);
    const inputsRef = useRef([]);

    useEffect(() => {
        if (resendIn <= 0) return;
        const timer = setTimeout(() => setResendIn((seconds) => seconds - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendIn]);

    // Opened directly, without going through the email step.
    if (!email) {
        return <Navigate to={`${portal.basePath}/forgot-password`} replace />;
    }

    const code = digits.join("");
    const isComplete = code.length === CODE_LENGTH;

    const focusInput = (index) => {
        const input = inputsRef.current[Math.max(0, Math.min(index, CODE_LENGTH - 1))];
        input?.focus();
        input?.select();
    };

    // Writes one or more digits starting at `index` (covers typing and pasting).
    const fillFrom = (index, value) => {
        const incoming = value.replace(/\D/g, "").slice(0, CODE_LENGTH - index);
        if (!incoming) return;

        const next = [...digits];
        incoming.split("").forEach((digit, offset) => {
            next[index + offset] = digit;
        });

        setDigits(next);
        setError("");
        focusInput(index + incoming.length);
    };

    const handleChange = (index, e) => {
        const { value } = e.target;

        if (value === "") {
            const next = [...digits];
            next[index] = "";
            setDigits(next);
            return;
        }

        fillFrom(index, value);
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            e.preventDefault();
            const next = [...digits];
            next[index - 1] = "";
            setDigits(next);
            focusInput(index - 1);
        } else if (e.key === "ArrowLeft" && index > 0) {
            e.preventDefault();
            focusInput(index - 1);
        } else if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
            e.preventDefault();
            focusInput(index + 1);
        }
    };

    const handlePaste = (index, e) => {
        e.preventDefault();
        fillFrom(index, e.clipboardData.getData("text"));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!isComplete) {
            setError(`Enter the ${CODE_LENGTH}-digit code we sent to your email.`);
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            // TODO: replace with the real request, e.g.
            // await authService.verifyResetCode({ email, code });
            // The backend has no verify endpoint yet, so any 4 digits pass for now.
            await new Promise((resolve) => setTimeout(resolve, 500)); // placeholder
            navigate(`${portal.basePath}/reset-password`, { state: { email, code } });
        } catch {
            setError("That code is incorrect or has expired. Try again or request a new one.");
            setDigits(Array(CODE_LENGTH).fill(""));
            focusInput(0);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (resendIn > 0) return;

        setError("");
        setDigits(Array(CODE_LENGTH).fill(""));
        setResendIn(RESEND_SECONDS);
        focusInput(0);

        // TODO: replace with the real request, e.g.
        // await authService.sendResetCode({ email });  -> POST /api/auth/forgot
    };

    return (
        <AuthSplit
            portal={portal}
            title="Enter verification code"
            subtitle={
                <>
                    We sent a {CODE_LENGTH}-digit code to{' '}
                    <span className="font-semibold text-slate-700">{email}</span>.
                </>
            }
            error={error}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div disabled={isSubmitting} className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700 mb-1">Verification code</label>
                    <div className='flex items-center justify-center '>
                        <div className="flex justify-between  gap-3">
                            {digits.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputsRef.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={CODE_LENGTH}
                                    autoComplete={index === 0 ? "one-time-code" : "off"}
                                    autoFocus={index === 0}
                                    aria-label={`Digit ${index + 1} of ${CODE_LENGTH}`}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={(e) => handlePaste(index, e)}
                                    onFocus={(e) => e.target.select()}
                                    className={clsx(
                                        "w-12 h-10 border border-gray-300 rounded-sm text-center text-2xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500",
                                        error && "border-red-500 focus:ring-red-400"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    label={isSubmitting ? "Verifying…" : "Verify Code"}
                    disabled={isSubmitting || !isComplete}
                    aria-busy={isSubmitting}
                    className="w-full bg-slate-800 text-white text-sm hover:bg-slate-900 transition-colors py-1.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                />

                <div className="text-center flex flex-col gap-1 text-xs text-slate-600">
                    <div>
                        Didn't get a code?{' '}
                        {resendIn > 0 ? (
                            <span className="text-slate-500">Resend in {resendIn}s</span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-slate-800 font-medium hover:underline"
                            >
                                Resend code
                            </button>
                        )}
                    </div>
                    <div>
                        <Link
                            to={`${portal.basePath}/forgot-password`}
                            className="text-slate-800 font-medium hover:underline"
                        >
                            Use a different email
                        </Link>
                    </div>
                </div>
            </form>
        </AuthSplit>
    );
};

export default VerifyCode;
