import handleAsyncError from "../middleware/handleAsyncError.js";
import handleError from "../utils/handleError.js";
import bcrypt from "bcrypt";
import { addStaffSchema, updateStaffSchema } from "../utils/validation.js";
import { generateUniqueStaffId } from "../utils/generateStaffId.js";
import { parseBody } from "../utils/parseBody.js";
import {
    listStaff,
    findStaffByIdentifier,
    findStaffByUserId,
    departmentExists,
    userEmailExists,
    createUserWithStaff,
    updateStaffAndUser,
    deleteStaffUser,
} from "../services/staff.service.js";

// ADD STAFF
export const addStaff = handleAsyncError(async (req, res, next) => {
    const { data, error: validationError } = parseBody(addStaffSchema, req.body);

    if (validationError) {
        return next(new handleError(validationError, 400));
    }

    const { email, password, role, departmentId } = data;

    if (!password) {
        return next(
            new handleError(
                "Password is required when creating a staff account",
                400
            )
        );
    }

    if (departmentId && !(await departmentExists(departmentId))) {
        return next(new handleError("Department not found", 404));
    }

    const staffId = await generateUniqueStaffId(role);
    const passwordHash = await bcrypt.hash(password, 10);

    try {
        if (await userEmailExists(email)) {
            return next(
                new handleError(
                    "A user with this email already exists",
                    409
                )
            );
        }

        const { user, staff } = await createUserWithStaff({
            ...data,
            passwordHash,
            staffId,
        });

        return res.status(201).json({
            success: true,
            message: "Staff member added successfully",
            staff: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                ...staff,
            },
        });
    } catch (error) {
        if (error instanceof handleError) {
            return next(error);
        }

        console.error("Add staff error:", error);
        return next(new handleError("Failed to add staff member", 500));
    }
});

// GET ALL STAFF
export const getAllStaff = handleAsyncError(async (req, res, next) => {
    const staffList = await listStaff();

    res.status(200).json({
        success: true,
        count: staffList.length,
        staffs: staffList
    });
});

// GET SINGLE STAFF
export const getStaffById = handleAsyncError(async (req, res, next) => {
    const staff = await findStaffByIdentifier(req.params.id);

    if (!staff) {
        return next(new handleError("Staff member not found", 404));
    }

    res.status(200).json({
        success: true,
        staff
    });
});

// MY PROFILE
export const myProfile = handleAsyncError(async (req, res, next) => {
    const staff = await findStaffByUserId(req.user.id);

    if (!staff) {
        return next(new handleError("Staff profile not found", 404));
    }

    res.status(200).json({
        success: true,
        user: staff
    });
});

// UPDATE STAFF
export const updateStaff = handleAsyncError(async (req, res, next) => {
    const { data, error: validationError } = parseBody(updateStaffSchema, req.body);

    if (validationError) {
        return next(new handleError(validationError, 400));
    }

    const current = await findStaffByIdentifier(req.params.id);

    if (!current) {
        return next(new handleError("Staff member not found", 404));
    }

    const staff = await updateStaffAndUser(current, data);

    res.status(200).json({
        success: true,
        message: "Staff member updated successfully",
        staff
    });
});

// DELETE OR DEACTIVATE STAFF
export const deleteStaff = handleAsyncError(async (req, res, next) => {
    const staffRecord = await findStaffByIdentifier(req.params.id);

    if (!staffRecord) {
        return next(new handleError("Staff member not found", 404));
    }

    await deleteStaffUser(staffRecord.user_id);

    res.status(200).json({
        success: true,
        message: "Staff member deleted successfully"
    });
});
