import handleError from "../utils/handleError.js";
import handleAsyncError from "./handleAsyncError.js";
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

export const authenticateUser = handleAsyncError( async (req, res, next) => {
    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    if(!token){
        return next (
            new handleError(
                "Authentication token is missing? Login to your account",
                401
            )
        );
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const users = await sql`
            SELECT id, email, role, is_active, created_at, updated_at 
            FROM users 
            WHERE id = ${decoded.id}
        `;

        if (!users || users.length === 0) {
            return next(
                new handleError(
                    "User not found with this token",
                    404
                )
            );
        }

        if (!users[0].is_active) {
            return next(
                new handleError(
                    "User account is inactive",
                    403
                )
            );
        }

        req.user = users[0];
        next();
    } catch (err) {
        return next(
            new handleError(
                "Invalid or expired token",
                401
            )
        );
    }
});

export const roleBasedAccess = (...roles)=>{
    return (req,res,next)=>{
        if(!req.user || !roles.includes(req.user.role)){
            return next (
                new handleError(
                    `Role ${req.user?.role || "Unknown"} is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    };
};