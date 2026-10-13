import crypto from "crypto";
import { sql } from "../config/db.js";

export const RESET_CODE_LENGTH = 4;
export const RESET_CODE_TTL_MINUTES = 5;
const MAX_VERIFY_ATTEMPTS = 5;

const hashCode = (code) => crypto.createHash("sha256").update(String(code)).digest("hex");

// GENERATE A 4 DIGIT CODE (leading zeros kept, e.g. "0042")
export const generateResetCode = () =>
    String(crypto.randomInt(0, 10 ** RESET_CODE_LENGTH)).padStart(RESET_CODE_LENGTH, "0");

// CREATE + STORE A CODE FOR A USER
// Only the hash is stored. Returns the plain code so it can be emailed.
export const createResetCode = async (userId) => {
    const code = generateResetCode();

    await sql`
        INSERT INTO password_reset_codes (user_id, code_hash, attempts, expires_at, created_at)
        VALUES (
            ${userId},
            ${hashCode(code)},
            0,
            now() + make_interval(mins => ${RESET_CODE_TTL_MINUTES}),
            now()
        )
        ON CONFLICT (user_id) DO UPDATE
        SET
            code_hash = EXCLUDED.code_hash,
            attempts = 0,
            expires_at = EXCLUDED.expires_at,
            created_at = EXCLUDED.created_at
    `;

    return code;
};

// VERIFY A CODE
// Every call counts as an attempt; expired or over-attempted codes never match.
export const verifyResetCode = async (userId, code) => {
    const rows = await sql`
        UPDATE password_reset_codes
        SET attempts = attempts + 1
        WHERE user_id = ${userId}
            AND expires_at > now()
            AND attempts < ${MAX_VERIFY_ATTEMPTS}
        RETURNING code_hash
    `;

    if (!rows || rows.length === 0) return false;

    const stored = Buffer.from(rows[0].code_hash, "hex");
    const given = Buffer.from(hashCode(code), "hex");

    return stored.length === given.length && crypto.timingSafeEqual(stored, given);
};

// DELETE A USER'S CODE (after a successful reset)
export const deleteResetCode = (userId) => sql`
    DELETE FROM password_reset_codes WHERE user_id = ${userId}
`;
