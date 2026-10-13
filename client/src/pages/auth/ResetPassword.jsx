import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AuthSplit from "../../components/layouts/AuthSplit.jsx";
import TextBox from "../../components/ui/TextBox.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuthPortal } from "./authPortal.js";

const MIN_PASSWORD_LENGTH = 6;

const ResetPassword = ({ role }) => {
    const portal = useAuthPortal(role);
    const { email, code } = useLocation().state || {};

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    // Opened directly, without a verified code.
    if (!email || !code) {
        return <Navigate to={`${portal.basePath}/forgot-password`} replace />;
    }

    const validate = () => {
        const errors = {};

        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            errors.newPassword = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
        }
        if (confirmPassword !== newPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const errors = validate();
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setError("");
        setIsSubmitting(true);

        try {
            // TODO: replace with the real request, e.g.
            // await authService.resetPassword({ email, code, newPassword });  -> POST /api/auth/reset
            await new Promise((resolve) => setTimeout(resolve, 500)); // placeholder
            setIsDone(true);
        } catch {
            setError("We couldn't reset your password. Try again or request a new code.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isDone) {
        return (
            <AuthSplit portal={portal} title="Password updated">
                <div className="flex flex-col gap-4 text-center">
                    <div
                        role="status"
                        className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
                    >
                        Your password has been reset. Sign in with your new password.
                    </div>
                    <Link
                        to={portal.loginPath}
                        className="w-full rounded font-semibold bg-slate-800 text-white text-sm hover:bg-slate-900 transition-colors px-2 py-1.5"
                    >
                        {portal.backText}
                    </Link>
                </div>
            </AuthSplit>
        );
    }

    return (
        <AuthSplit
            portal={portal}
            title="Set a new password"
            subtitle={
                <>
                    Choose a new password for{' '}
                    <span className="font-semibold text-slate-700">{email}</span>.
                </>
            }
            error={error}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <TextBox
                    label="New password"
                    name="newPassword"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    autoFocus
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={fieldErrors.newPassword}
                    required
                    disabled={isSubmitting}
                />
                <TextBox
                    label="Confirm new password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={fieldErrors.confirmPassword}
                    required
                    disabled={isSubmitting}
                />

                <Button
                    type="submit"
                    label={isSubmitting ? "Saving…" : "Reset Password"}
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="w-full bg-slate-800 text-white text-sm hover:bg-slate-900 transition-colors py-1.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                />

                <div className="text-center text-xs text-slate-600">
                    <Link to={portal.loginPath} className="text-slate-800 font-medium hover:underline">
                        {portal.backText}
                    </Link>
                </div>
            </form>
        </AuthSplit>
    );
};

export default ResetPassword;
