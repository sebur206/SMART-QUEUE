import { sql } from "../config/db.js";

// GET ALL STAFF
export const listStaff = () => sql`
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

// FIND STAFF BY USER ID OR STAFF ID
export const findStaffByIdentifier = async (id) => {
    const staffMembers = await sql`
        SELECT s.*, u.email, u.role, d.department_name
        FROM staffs s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN departments d ON s.department_id = d.id
        WHERE s.user_id::text = ${id} OR s.staff_id = ${id}
        LIMIT 1
    `;

    return staffMembers?.[0];
};

// FIND STAFF BY USER ID
export const findStaffByUserId = async (userId) => {
    const staffMembers = await sql`
        SELECT s.*, u.email, u.role, d.department_name
        FROM staffs s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN departments d ON s.department_id = d.id
        WHERE s.user_id = ${userId}
        LIMIT 1
    `;

    return staffMembers?.[0];
};

export const departmentExists = async (departmentId) => {
    const department = await sql`
        SELECT id
        FROM departments
        WHERE id = ${departmentId}
        LIMIT 1
    `;

    return department.length > 0;
};

export const userEmailExists = async (email) => {
    const existingUser = await sql`
        SELECT id
        FROM users
        WHERE email = ${email}
        LIMIT 1
    `;

    return existingUser.length > 0;
};

// CREATE USER + STAFF
// Removes the user row again if the staff insert fails, then rethrows.
export const createUserWithStaff = async ({
    email,
    passwordHash,
    role,
    staffId,
    firstName,
    lastName,
    otherName,
    departmentId,
}) => {
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

    try {
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

        return { user, staff: createdStaff[0] };
    } catch (error) {
        try {
            await sql`DELETE FROM users WHERE id = ${user.id}`;
        } catch (cleanupErr) {
            console.error("Failed to clean up user after staff creation error:", cleanupErr);
        }

        throw error;
    }
};

// UPDATE STAFF
// `current` is the row from findStaffByIdentifier, `data` the validated body.
export const updateStaffAndUser = async (current, data) => {
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

    return {
        ...updatedStaff[0],
        email: updatedEmail,
        role: updatedRole,
    };
};

// DELETE STAFF
// Deleting from users will cascade to staffs due to foreign key ON DELETE CASCADE
export const deleteStaffUser = (userId) => sql`
    DELETE FROM users WHERE id = ${userId}
`;
