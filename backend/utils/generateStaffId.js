

import { sql } from "../config/db.js";

const ROLE_PREFIXES = {
    doctor: "DOC",
    nurse: "NUR",
    receptionist: "REC",
    admin: "ADM"
};

export const generateStaffId = (role, sequenceNumber) => {
    const normalizedRole = (role || "").toLowerCase().trim();
    const prefix = ROLE_PREFIXES[normalizedRole] || "STF";

    if (sequenceNumber !== undefined && sequenceNumber !== null) {
        const paddedSeq = String(sequenceNumber).padStart(3, "0");
        return `${prefix}-${paddedSeq}`;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    return `${prefix}-${randomNum}`;
};

export const generateUniqueStaffId = async (role) => {
    const normalizedRole = (role || "").toLowerCase().trim();
    const countResult = await sql`
        SELECT COUNT(*) as count 
        FROM staffs s 
        JOIN users u ON s.user_id = u.id 
        WHERE LOWER(u.role) = ${normalizedRole}
    `;
    const nextSeq = parseInt(countResult[0]?.count || 0, 10) + 1;
    let newStaffId = generateStaffId(normalizedRole, nextSeq);

    // Collision check
    let existing = await sql`
        SELECT user_id FROM staffs WHERE staff_id = ${newStaffId} LIMIT 1
    `;

    while (existing.length > 0) {
        newStaffId = generateStaffId(normalizedRole);
        existing = await sql`
            SELECT user_id FROM staffs WHERE staff_id = ${newStaffId} LIMIT 1
        `;
    }

    return newStaffId;
};