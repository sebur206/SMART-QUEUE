import { createUserSchema, USER_ROLES,  } from "./user.schema.js";
import { createDepartmentSchema } from "./department.schema.js";
import { createStaffSchema,  } from "./staff.schema.js";
import { createServiceSchema } from "./service.schema.js";
import { createPatientSchema } from "./patient.schema.js";

export const initAllSchemas = async () => {
    try {
        console.log("Initializing database schemas...");
        await createUserSchema();
        await createStaffSchema();
        await createDepartmentSchema();


        // await createServiceSchema();
        // await createPatientSchema();
        console.log("All database schemas initialized successfully.");
    } catch (err) {
        console.error("Database schema initialization failed:", err);
        throw err;
    }
};

export { 
    createUserSchema, 


    createDepartmentSchema,
    createStaffSchema, 
    createServiceSchema,
    createPatientSchema, 


};
