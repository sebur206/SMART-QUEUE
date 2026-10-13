import { initAllSchemas } from "../schemas/index.js";

export const initDB = async (req, res) => {
    try {
        await initAllSchemas();
        if (res && typeof res.status === 'function') {
            return res.status(200).json({ message: "Schemas initialized successfully" });
        }
    } catch (err) {
        console.error("Database initialization error:", err);
        if (res && typeof res.status === 'function') {
            return res.status(500).json({
                message: "Database initialization failed",
                error: err.message
            });
        }
        throw err;
    }
};