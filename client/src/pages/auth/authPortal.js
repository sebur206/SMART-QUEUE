import { useLocation } from 'react-router-dom';

const PORTALS = {
    staff: {
        role: 'staff',
        portalName: 'Staff Portal',
        basePath: '/auth/staff',
        loginPath: '/auth/staff/login',
        backText: 'Back to Staff Sign In',
        tagline: 'Every shift starts with a secure sign in.',
        blurb: 'Access schedules, queues, and more — all in one place.',
    },
    patient: {
        role: 'patient',
        portalName: 'Patient Portal',
        basePath: '/auth/patient',
        loginPath: '/auth/patient/login',
        backText: 'Back to Sign In',
        tagline: 'Your care, always within reach.',
        blurb: 'View appointments, test results, and messages from your care team — securely, from anywhere.',
    },
};

// Staff when the route says so (prop or /staff in the path), patient otherwise.
export const useAuthPortal = (initialRole) => {
    const { pathname } = useLocation();
    const isStaff = initialRole === 'staff' || pathname.includes('/staff');

    return PORTALS[isStaff ? 'staff' : 'patient'];
};
