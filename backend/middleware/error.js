export default (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle JSON Web Token Error
    if (err.name === "JsonWebTokenError") {
        message = "Json Web Token is invalid, try again";
        statusCode = 400;
    }

    // Handle JWT Expired Error
    if (err.name === "TokenExpiredError") {
        message = "Json Web Token has expired, try again";
        statusCode = 400;
    }

    // Handle PostgreSQL Duplicate Key Error (Code 23505)
    if (err.code === "23505") {
        message = `Duplicate field value entered: ${err.detail || "Resource already exists"}`;
        statusCode = 409;
    }

    // Handle PostgreSQL Foreign Key Violation (Code 23503)
    if (err.code === "23503") {
        message = `Foreign key violation: ${err.detail || "Referenced resource does not exist"}`;
        statusCode = 400;
    }

    // Handle PostgreSQL Check Constraint Violation (Code 23514)
    if (err.code === "23514") {
        message = `Validation check failed: ${err.detail || "Invalid value supplied"}`;
        statusCode = 400;
    }

    if (err.code === "23502") {
        message = `Validation check failed: ${err.detail || "Invalid value supplied"}`;
        statusCode = 400;
    }



    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
};