import handleAsyncError from "../middleware/handleAsyncError.js";
import handleError from "../utils/handleError.js";
import {staffSignUpSchema} from "../utils/validation.js";


export const addDepartment = handleAsyncError(async (req, res, next) => {
    const parseData = staffSignUpSchema.safeParse(req.body);

    if (!parseData.success) {
        const errorMsg = parseData.error.issues?.map(err => err.message).join(", ")
            || parseData.error.errors?.map(err => err.message).join(", ")
            || "Validation failed";
        return next(new handleError(errorMsg, 400));
    }

    const existingDepartment = await  sql `
        SELECT * FROM departments
        WHERE department_id = $1
    `;

    if (existingDepartment && existingDepartment.length > 0) {
        return next(
            new handleError(
                "A department with this name already exists",
                407
            )
        );
    }

    const createDepartment = await  sql `
        INSERT INTO  departments ( 
                                
        ) VALUES  (
                   
        )
    ` ;

    if(!createDepartment || createDepartment.length === 0){
        return next(
            new handleError(
                "Failed to create department",
                500
            )
        )
    }

    res.status(200).json({
        success: true,
        message: "Department Added successfully"
    });
});


export const getAllDepartments = handleAsyncError(async (req, res, next) => {

})

export const getDepartment = handleAsyncError(async (req, res, next) => {

})

export const updateDepartment = handleAsyncError(async (req, res, next) => {

})

export const deleteDepartment = handleAsyncError(async (req, res, next) => {

})