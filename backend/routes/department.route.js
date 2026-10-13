import express from 'express'
import {
    addDepartment, deleteDepartment,
    getAllDepartments,
    getDepartment,
    updateDepartment
} from "../controller/department.controller.js";



const router = express.Router()

router.post("/add", addDepartment);
router.get("/all", getAllDepartments);
router.get("/:id", getDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);


export default  router