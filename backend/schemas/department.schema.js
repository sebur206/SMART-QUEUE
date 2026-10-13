import {sql} from "../config/db.js";


export const createDepartmentSchema = async () =>{
    await  sql `
        CREATE TABLE IF NOT EXISTS departments (
            id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            department_name VARCHAR(255) UNIQUE NOT NULL,
            description TEXT ,
            created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    `

    console.log("Department schema initialized");
}