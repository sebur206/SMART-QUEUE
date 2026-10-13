import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, res, message = "Login successfully") => {
    const token = jwt.sign(
        {
            id: user.id,
            staffId: user.staff_id,
            email: user.email,
            role: user.role
        },
        process.env.SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const cookieOptions = {
        expires: new Date(
            Date.now() + (Number(process.env.COOKIE_EXPIRES_IN) || 7)  * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
        cookieOptions.sameSite = 'strict';
    }

    const { password_hash, ...safeUser } = user;

    res.status(statusCode).cookie('token', token, cookieOptions).json({
        success: true,
        message,
        user: safeUser,
        token
    });
};