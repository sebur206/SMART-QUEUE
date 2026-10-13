import handleAsyncError from "../middleware/handleAsyncError.js";
import {patientDataValidation} from "../utils/validation.js";



export const addPatient = handleAsyncError(async (req, res, next) => {
        const patientData = patientDataValidation.safeParse(req.body)
})


export const getAllPatient = handleAsyncError(async (req, res, next) => {

})

export const getPatient = handleAsyncError(async (req, res, next) => {

})

export const updatePatient = handleAsyncError(async (req, res, next) => {

})

export const deletePatient = handleAsyncError(async (req, res, next) => {

})





