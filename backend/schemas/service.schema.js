import { sql } from "../config/db.js";

export const createServiceSchema = async () => {
    await sql`
        CREATE TABLE IF NOT EXISTS services (
            id SERIAL PRIMARY KEY,
            department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
            service_name VARCHAR(255) UNIQUE NOT NULL,
            avg_duration_min INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        )
    `;

    console.log("Service schema initialized");
};
