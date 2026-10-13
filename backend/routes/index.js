import express from "express";
import authRoutes from './auth.route.js';
import deptRoutes from './department.route.js';
import serviceRoutes from './service.route.js';
import staffRoutes from './staff.route.js';
import patientRoutes from './patient.route.js';

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/dept", deptRoutes);
router.use("/services", serviceRoutes);
router.use("/staff", staffRoutes);
router.use("/patient", patientRoutes);

export default router;