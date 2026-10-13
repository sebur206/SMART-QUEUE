import express from 'express'
import {
    addService,
    deleteService,
    getAllServices,
    getService,
    updateService
} from "../controller/service.controller.js";


const router = express.Router()

router.post("/add", addService);
router.get("/all", getAllServices);
router.get("/:id", getService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);


export default  router