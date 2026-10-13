import { sql } from "../config/db.js";

export const createPasswordResetSchema = async () => {
    // One active code per user: requesting a new code replaces the old one.
    await sql`
        CREATE TABLE IF NOT EXISTS password_reset_codes (
            user_id UUID PRIMARY KEY
            REFERENCES users(id)
            ON DELETE CASCADE,

            code_hash VARCHAR(64) NOT NULL,
            attempts INTEGER NOT NULL DEFAULT 0,
            expires_at TIMESTAMPTZ NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
    `;

    console.log("Password reset schema initialized");
};
