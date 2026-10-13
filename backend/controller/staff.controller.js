import handleAsyncError from "../middleware/handleAsyncError.js";
import handleError from "../utils/handleError.js";
import bcrypt from "bcrypt";
import { sql } from "../config/db.js";
import { addStaffSchema, updateStaffSchema } from "../utils/validation.js";
import { generateUniqueStaffId } from "../utils/generateStaffId.js";

// ADD STAFF
export const addStaff = handleAsyncError(async (req, res, next) => {
    const parseData = addStaffSchema.safeParse(req.body);

    if (!parseData.success) {
        const errorMsg =
            parseData.error.issues?.map((err) => err.message).join(", ") ||
            "Validation failed";

        return next(new handleError(errorMsg, 400));
    }

    const {
        firstName,
        lastName,
        otherName,
        email,
        password,
        role,
        departmentId,
    } = parseData.data;

    if (!password) {
        return next(
            new handleError(
                "Password is required when creating a staff account",
                400
            )
        );
    }

    if (departmentId) {
        const department = await sql`
            SELECT id
            FROM departments
            WHERE id = ${departmentId}
            LIMIT 1
        `;

        if (department.length === 0) {
            return next(new handleError("Department not found", 404));
        }
    }

    const staffId = await generateUniqueStaffId(role);
    const passwordHash = await bcrypt.hash(password, 10);

    let createdUserId = null;
    try {
        const existingUser = await sql`
            SELECT id
            FROM users
            WHERE email = ${email}
            LIMIT 1
        `;

        if (existingUser.length > 0) {
            return next(
                new handleError(
                    "A user with this email already exists",
                    409
                )
            );
        }

        const createdUser = await sql`
            INSERT INTO users (
                email,
                password_hash,
                role,
                is_active
            )
            VALUES (
                ${email},
                ${passwordHash},
                ${role},
                true
            )
            RETURNING id, email, role, is_active
        `;

        const user = createdUser[0];
        createdUserId = user.id;

        const createdStaff = await sql`
            INSERT INTO staffs (
                user_id,
                staff_id,
                first_name,
                last_name,
                other_name,
                
                department_id,
                is_active
            )
            VALUES (
                ${user.id},
                ${staffId},
                ${firstName},
                ${lastName},
                ${otherName || null},
                
                ${departmentId || null},
                true
            )
            RETURNING *
        `;

        return res.status(201).json({
            success: true,
            message: "Staff member added successfully",
            staff: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                ...createdStaff[0],
            },
        });
    } catch (error) {
        if (createdUserId) {
            try {
                await sql`DELETE FROM users WHERE id = ${createdUserId}`;
            } catch (cleanupErr) {
                console.error("Failed to clean up user after staff creation error:", cleanupErr);
            }
        }

        if (error instanceof handleError) {
            return next(error);
        }

        console.error("Add staff error:", error);
        return next(new handleError("Failed to add staff member", 500));
    }
});

// GET ALL STAFF
export const getAllStaff = handleAsyncError(async (req, res, next) => {
   const  staffList = await sql`
            SELECT 
                s.*, 
                u.email,
                u.role, 
                d.department_name 
            FROM staffs s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN departments d ON s.department_id = d.id
            ORDER BY s.created_at DESC
        `;
    res.status(200).json({
        success: true,
        count: staffList.length,
        staffs: staffList
    });
});

// GET SINGLE STAFF
export const getStaffById = handleAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const staffMembers = await sql`
        SELECT s.*, u.email, u.role, d.department_name 
        FROM staffs s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN departments d ON s.department_id = d.id
        WHERE s.user_id::text = ${id} OR s.staff_id = ${id}
        LIMIT 1
    `;

    if (!staffMembers || staffMembers.length === 0) {
        return next(new handleError("Staff member not found", 404));
    }

    res.status(200).json({
        success: true,
        staff: staffMembers[0]
    });
});

// MY PROFILE
export const myProfile = handleAsyncError(async (req, res, next) => {
    const user = req.user;

    const staffMembers = await sql`
        SELECT s.*, u.email, u.role, d.department_name 
        FROM staffs s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN departments d ON s.department_id = d.id
        WHERE s.user_id = ${user.id}
        LIMIT 1
    `;

    if (!staffMembers || staffMembers.length === 0) {
        return next(new handleError("Staff profile not found", 404));
    }

    res.status(200).json({
        success: true,
        user: staffMembers[0]
    });
});

// UPDATE STAFF
export const updateStaff = handleAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const parseResult = updateStaffSchema.safeParse(req.body);

    if (!parseResult.success) {
        const errorMsg = parseResult.error.issues?.map(err => err.message).join(", ")
            || parseResult.error.errors?.map(err => err.message).join(", ")
            || "Validation failed";
        return next(new handleError(errorMsg, 400));
    }

    const existingStaff = await sql`
        SELECT s.*, u.email, u.role 
        FROM staffs s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.user_id::text = ${id} OR s.staff_id = ${id} 
        LIMIT 1
    `;

    if (!existingStaff || existingStaff.length === 0) {
        return next(new handleError("Staff member not found", 404));
    }

    const current = existingStaff[0];
    const data = parseResult.data;

    const updatedFirstName = data.firstName !== undefined ? data.firstName : current.first_name;
    const updatedLastName = data.lastName !== undefined ? data.lastName : current.last_name;
    const updatedOtherName = data.otherName !== undefined ? data.otherName : current.other_name;
    const updatedEmail = data.email !== undefined ? data.email : current.email;
    const updatedRole = data.role !== undefined ? data.role : current.role;
    const updatedDepartmentId = data.departmentId !== undefined ? data.departmentId : current.department_id;
    const updatedPhone = data.phone !== undefined ? data.phone : current.phone;
    const updatedIsActive = data.isActive !== undefined ? data.isActive : current.is_active;

    const updatedStaff = await sql`
        UPDATE staffs
        SET 
            first_name = ${updatedFirstName},
            last_name = ${updatedLastName},
            other_name = ${updatedOtherName},
            department_id = ${updatedDepartmentId},
            phone = ${updatedPhone},
            is_active = ${updatedIsActive},
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${current.user_id}
        RETURNING *
    `;

    // Also update users table if email or role or active status changed
    if (data.email || data.role || data.isActive !== undefined) {
        await sql`
            UPDATE users
            SET 
                email = ${updatedEmail},
                role = ${updatedRole},
                is_active = ${updatedIsActive},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${current.user_id}
        `;
    }

    res.status(200).json({
        success: true,
        message: "Staff member updated successfully",
        staff: {
            ...updatedStaff[0],
            email: updatedEmail,
            role: updatedRole
        }
    });
});

// DELETE OR DEACTIVATE STAFF
export const deleteStaff = handleAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const existingStaff = await sql`
        SELECT s.*, u.email 
        FROM staffs s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.user_id::text = ${id} OR s.staff_id = ${id} 
        LIMIT 1
    `;

    if (!existingStaff || existingStaff.length === 0) {
        return next(new handleError("Staff member not found", 404));
    }

    const staffRecord = existingStaff[0];

    // Deleting from users will cascade to staffs due to foreign key ON DELETE CASCADE
    await sql`
        DELETE FROM users WHERE id = ${staffRecord.user_id}
    `;

    res.status(200).json({
        success: true,
        message: "Staff member deleted successfully"
    });
});
