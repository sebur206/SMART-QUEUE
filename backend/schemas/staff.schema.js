import { sql } from "../config/db.js";

export const createStaffSchema = async () => {
    await sql`
        CREATE TABLE IF NOT EXISTS staffs (
            user_id UUID PRIMARY KEY
            REFERENCES users(id)
            ON DELETE CASCADE,

            staff_id VARCHAR(50) UNIQUE NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            other_name VARCHAR(255),
            specialization VARCHAR(255),
            
            department_id UUID
            REFERENCES departments(id)
            ON DELETE SET NULL,

            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
    `;

    console.log("Staff schema initialized");
};
