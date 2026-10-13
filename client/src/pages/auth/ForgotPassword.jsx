import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthSplit from "../../components/layouts/AuthSplit.jsx";
import TextBox from "../../components/ui/TextBox.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuthPortal } from "./authPortal.js";

const ForgotPassword = ({ role }) => {
    const portal = useAuthPortal(role);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setError("");
        setIsSubmitting(true);

        try {
            // TODO: replace with the real request, e.g.
            // await authService.sendResetCode({ email: email.trim() });  -> POST /api/auth/forgot
            await new Promise((resolve) => setTimeout(resolve, 500)); // placeholder
            navigate(`${portal.basePath}/verify-code`, { state: { email: email.trim() } });
        } catch {
            setError("We couldn't send the code. Check the email address and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthSplit
            portal={portal}
            title="Forgot password"
            subtitle="Enter your email address and we'll send you a 4-digit verification code."
            error={error}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <TextBox
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                />

                <Button
                    type="submit"
                    label={isSubmitting ? "Sending…" : "Send Code"}
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="w-full bg-slate-800 text-white text-sm hover:bg-slate-900 transition-colors py-1.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                />

                <div className="text-center text-xs text-slate-600">
                    Remember your password?{' '}
                    <Link to={portal.loginPath} className="text-slate-800 font-medium hover:underline">
                        {portal.backText}
                    </Link>
                </div>
            </form>
        </AuthSplit>
    );
};

export default ForgotPassword;
