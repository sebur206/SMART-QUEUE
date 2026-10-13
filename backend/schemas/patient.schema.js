import { sql } from "../config/db.js";

export const createPatientSchema = async () => {

    await sql`
        CREATE TABLE IF NOT EXISTS patients (
            user_id UUID PRIMARY KEY
            REFERENCES users(id)
            ON DELETE CASCADE,
            
            patient_id VARCHAR UNIQUE NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            other_name VARCHAR(255),
            date_of_birth DATE,
            gender VARCHAR(20),
            phone VARCHAR(30),
            address TEXT,
            emergency_contact_name VARCHAR(255),
            emergency_contact_phone VARCHAR(30),
            blood_group VARCHAR(10),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // Patient Reset Tokens / OTPs Table
    await sql`
        CREATE TABLE IF NOT EXISTS patient_schema.patient_tokens (
            id SERIAL PRIMARY KEY,
            patient_id INTEGER REFERENCES patient_schema.patients(id) ON DELETE CASCADE,
            token VARCHAR(255) NOT NULL,
            token_type VARCHAR(50) NOT NULL, -- e.g. 'otp', 'reset_password', 'refresh'
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    console.log("Patient schema initialized");
};
