import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import TextBox from "../../components/ui/TextBox.jsx";
import Button from "../../components/ui/Button.jsx";
import {useDispatch, useSelector} from "react-redux";
import {validateForm} from "../../helpers/validations.js";
import {removeErrors, removeSuccess, staffLogin} from "../../store/slice/auth/authSlice.js";




const StaffLogin = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const {error, success, loading} = useSelector(state => state.auth);




    const [formData,setFormData] = useState({
        staffId:"",
        password:""
    });

    const loginRules = {
        staffId: [
            { type: "required", message: "Staff ID is required" },
        ],
        password: [
            { type: "required", message: "Password is required" },
            {
                type: "minLength",
                value: 4,
                message: "Password must be at least 4 characters",
            },
        ],
    }


    const handleChange = (e)=>{
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        setErrors((prev)=>({
            ...prev,
            [name]:"",
        }));

        if(error) dispatch(removeErrors())

    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorValidations = validateForm(formData, loginRules)
        setErrors(errorValidations)

        if(Object.keys(errorValidations).length > 0) return

        dispatch(staffLogin(formData))
    };

    useEffect(() => {
        if(success){
            console.log(success)
            dispatch(removeSuccess())
        }
    }, [dispatch, success]);

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-900">
            {/* Left Section — branding */}
            <div className="hidden md:flex relative w-full items-center justify-center p-10 overflow-hidden bg-slate-800">
                <div className="relative max-w-sm text-center">
                    <h1 className="text-4xl font-semibold mb-4 text-white">Meridian Health</h1>
                    <h2 className="text-lg font-medium mb-2 text-slate-200">
                        Every shift starts with a secure sign in.
                    </h2>
                    <p className="text-sm text-slate-400">
                        Access schedules, queues, and more — all in one place.
                    </p>
                </div>
            </div>

            {/* Right Section — login form */}
            <div className="w-full bg-slate-50 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-sm">
                    <div className="mb-6 text-center">
                        <p className="text-sm text-slate-500 font-medium">Meridian Health · Staff Portal</p>
                        <h2 className="text-2xl font-bold text-slate-800 mt-1">Sign in to continue</h2>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            aria-live="assertive"
                            className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                        <TextBox
                            label="Staff ID"
                            name="staffId"
                            placeholder="Enter your Staff ID"
                            autoComplete="username"
                            autoFocus
                            value={formData.staffId}
                            error={errors.staffId}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        <div>
                            <TextBox
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                value={formData.password}
                                error={errors.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                            <div className="flex justify-end mt-1">
                                <Link
                                    to="/auth/staff/forgot-password"
                                    className="text-xs text-slate-600 hover:text-slate-900 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            label={loading ? "Signing in…" : "Sign In"}
                            disabled={loading}
                            aria-busy={loading}
                            className="w-full bg-slate-800 text-white text-sm hover:bg-slate-900 transition-colors py-1.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StaffLogin;