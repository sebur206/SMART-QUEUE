import { z } from 'zod';
import { ALLOWED_USER_ROLES } from '../schemas/user.schema.js';

export const userRegisterSchema = z.object({
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(ALLOWED_USER_ROLES, {
        errorMap: () => ({ message: `Role must be one of: ${ALLOWED_USER_ROLES.join(', ')}` })
    }).optional()
});

export const userSignInSchema = z.object({
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    password: z.string().min(1, "Password is required")
});

export const staffSignUpSchema = z.object({
    firstName: z.string().min(1, "First name is required").trim(),
    lastName: z.string().min(1, "Last name is required").trim(),
    otherName: z.string().optional().nullable(),
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    role: z.enum(ALLOWED_USER_ROLES, {
        errorMap: () => ({ message: `Role must be one of: ${ALLOWED_USER_ROLES.join(', ')}` })
    }),
    departmentId: z.string().uuid("Invalid department ID").optional().nullable(),
    phone: z.string().optional().nullable()
});

export const addStaffSchema = staffSignUpSchema;

export const updateStaffSchema = z.object({
    firstName: z.string().min(1, "First name is required").trim().optional(),
    lastName: z.string().min(1, "Last name is required").trim().optional(),
    otherName: z.string().optional().nullable(),
    email: z.string().email("Invalid email address").toLowerCase().trim().optional(),
    role: z.enum(ALLOWED_USER_ROLES, {
        errorMap: () => ({ message: `Role must be one of: ${ALLOWED_USER_ROLES.join(', ')}` })
    }).optional(),
    departmentId: z.string().uuid("Invalid department ID").optional().nullable(),
    phone: z.string().optional().nullable(),
    isActive: z.boolean().optional()
});

export const staffSignInSchema = z.object({
    staffId: z.string().min(1, "Staff ID is required").trim(),
    password: z.string().min(1, "Password is required")
});



//PATIENT VALIDATION
export const patientDataValidation = z.object({
    firstName: z.string().min(1, "First name is required").trim(),
    lastName: z.string().min(1, "Last name is required").trim(),
    otherName: z.string().optional().nullable(),
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    phone: z.string().optional().nullable()
});

//LOGIN VALIDATION
export const staffDataValidation = z.object({

})
