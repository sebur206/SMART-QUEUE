import handleAsyncError from "../middleware/handleAsyncError.js";
import handleError from "../utils/handleError.js";
import {staffSignUpSchema} from "../utils/validation.js";


export const addService = handleAsyncError(async (req, res, next) => {
    const parseData = staffSignUpSchema.safeParse(req.body);


});


export const getAllServices = handleAsyncError(async (req, res, next) => {

})

export const getService = handleAsyncError(async (req, res, next) => {

})

export const updateService = handleAsyncError(async (req, res, next) => {

})

export const deleteService = handleAsyncError(async (req, res, next) => {

})