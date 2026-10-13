import express from "express";

import {authenticateUser, roleBasedAccess} from "../middleware/userAuth.js";
import {addPatient, deletePatient, getAllPatient, getPatient, updatePatient} from "../controller/patient.controller.js";

const router = express.Router();

router.post("/add",authenticateUser, roleBasedAccess("Receptionist"), addPatient);
router.post("/all",authenticateUser, getAllPatient);
router.post("/:id", authenticateUser, getPatient);
router.post("/:id", authenticateUser, updatePatient);
router.post("/:id", authenticateUser,deletePatient);

export default router;