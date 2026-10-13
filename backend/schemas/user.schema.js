import { sql } from "../config/db.js";

export const USER_ROLES = {
    ADMIN: "admin",
    DOCTOR: "doctor",
    NURSE: "nurse",
    RECEPTIONIST: "receptionist",
    PATIENT: "patient",
};

export const ALLOWED_USER_ROLES = Object.values(USER_ROLES);

export const createUserSchema = async () => {
    await sql`
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL CHECK (
            role IN ('admin', 'doctor', 'nurse', 'receptionist', 'patient')
            ),
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
    `;

    console.log("User schema initialized");
};