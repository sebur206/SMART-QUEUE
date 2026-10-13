
import handleAsyncError from "../middleware/handleAsyncError.js";
import handleError from "../utils/handleError.js";
import bcrypt from "bcrypt";
import { sql } from "../config/db.js";
import { staffSignInSchema } from "../utils/validation.js";
import { sendToken } from "../utils/jwtToken.js";

// Staff Login using only Staff ID and Password
export const StaffLogin = handleAsyncError(async (req, res, next) => {
    const parseData = staffSignInSchema.safeParse(req.body);

    if (!parseData.success) {
        const errorMsg =
            parseData.error.issues?.map((err) => err.message).join(", ") ||
            parseData.error.errors?.map((err) => err.message).join(", ") ||
            "Validation failed";
        return next(new handleError(errorMsg, 400));
    }

    const { staffId, password } = parseData.data;

    const staffRecords = await sql`
        SELECT 
            u.id,
            u.email,
            u.password_hash,
            u.role,
            u.is_active AS user_is_active,
            s.staff_id,
            s.first_name,
            s.last_name,
            s.other_name,
            s.department_id,
            s.is_active AS staff_is_active
        FROM staffs s
        JOIN users u ON s.user_id = u.id
        WHERE LOWER(s.staff_id) = ${staffId.toLowerCase().trim()}
        LIMIT 1
    `;

    if (!staffRecords || staffRecords.length === 0) {
        return next(new handleError("Invalid Staff ID or Password", 401));
    }

    const user = staffRecords[0];

    if (!user.user_is_active || !user.staff_is_active) {
        return next(
            new handleError(
                "Your account is deactivated. Please contact administrator.",
                403
            )
        );
    }

    // Compare password
    const isPasswordMatched = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatched) {
        return next(new handleError("Invalid Staff ID or Password", 401));
    }

    sendToken(user, 200, res, "Logged in successfully");
});

// Logout
export const logoutUser = handleAsyncError(async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

// UpdatePassword
export const updateUserPassword = handleAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!oldPassword || !newPassword) {
        return next(new handleError("Please provide both old and new password", 400));
    }

    if (newPassword.length < 6) {
        return next(new handleError("New password must be at least 6 characters", 400));
    }

    const users = await sql`
        SELECT * FROM users WHERE id = ${userId} LIMIT 1
    `;

    if (!users || users.length === 0) {
        return next(new handleError("User not found", 404));
    }

    const user = users[0];
    const isMatched = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatched) {
        return next(new handleError("Old password does not match", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await sql`
        UPDATE users 
        SET password_hash = ${newPasswordHash}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ${userId}
    `;

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
});

// ResetOTP
export const sendPasswordResetOTP = handleAsyncError(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new handleError("Please provide user email", 400));
    }

    const users = await sql`
        SELECT id, email FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1
    `;

    if (!users || users.length === 0) {
        return next(new handleError("No user found with this email", 404));
    }

    // Return success response for OTP dispatch
    res.status(200).json({
        success: true,
        message: "Password reset OTP sent to email"
    });
});

// ResetPassword
export const resetUserPassword = handleAsyncError(async (req, res, next) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        return next(new handleError("Please provide email and new password", 400));
    }

    if (newPassword.length < 6) {
        return next(new handleError("New password must be at least 6 characters", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    const updated = await sql`
        UPDATE users 
        SET password_hash = ${newPasswordHash}, updated_at = CURRENT_TIMESTAMP 
        WHERE email = ${email.toLowerCase().trim()}
        RETURNING id
    `;

    if (!updated || updated.length === 0) {
        return next(new handleError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
});