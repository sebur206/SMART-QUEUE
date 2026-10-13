// Two-column auth screen: branding on the left, form on the right (same format as the login pages).
const AuthSplit = ({ portal, title, subtitle, error, children }) => {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-900">
            {/* Left Section — branding */}
            <div className="hidden md:flex relative w-full items-center justify-center p-10 overflow-hidden bg-slate-800">
                <div className="relative max-w-sm text-center">
                    <h1 className="text-4xl font-semibold mb-4 text-white">Meridian Health</h1>
                    <h2 className="text-lg font-medium mb-2 text-slate-200">{portal.tagline}</h2>
                    <p className="text-sm text-slate-400">{portal.blurb}</p>
                </div>
            </div>

            {/* Right Section — form */}
            <div className="w-full bg-slate-50 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-sm">
                    <div className="mb-6 text-center">
                        <p className="text-sm text-slate-500 font-medium">Meridian Health · {portal.portalName}</p>
                        <h2 className="text-2xl font-bold text-slate-800 mt-1">{title}</h2>
                        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
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

                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthSplit;
