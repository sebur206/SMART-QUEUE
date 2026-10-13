import express from "express";
import {
    addStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff, myProfile
} from "../controller/staff.controller.js";
import { authenticateUser, roleBasedAccess } from "../middleware/userAuth.js";
import { USER_ROLES } from "../schemas/user.schema.js";

const router = express.Router();

// Routes for Staff Management
router.post("/add", addStaff);
router.get("/all",authenticateUser, getAllStaff);
router.get("/me", authenticateUser, myProfile);
router.get("/:id",authenticateUser, getStaffById);
router.put("/:id", authenticateUser, roleBasedAccess(USER_ROLES.ADMIN), updateStaff);
router.delete("/:id", authenticateUser, roleBasedAccess(USER_ROLES.ADMIN), deleteStaff);

export default router;
