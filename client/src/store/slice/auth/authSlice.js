import {createAsyncThunk, createSlice, isRejectedWithValue} from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:9000/api/auth";

export const staffLogin = createAsyncThunk(
    "auth/staffLogin",
    async ({staffId, password},{rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            }
            const {data} = await axios.post(
                `${API_URL}/staff/login`,
            {staffId,password},
                config
            )
            console.log(data)
            return data
        }catch(err) {
            return   rejectWithValue(
                err.response?.data?.message || err.message || "Login Failed"
            )
        }
    }
)



const authSlice = createSlice({
    name: "auth",
    initialState: {
        user:localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null,
        loading: false,
        error: null,
        message: null,
        isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
    },

    reducers: {
        removeErrors : (state) => {
            state.error = null;
        },
        removeSuccess : (state) => {
            state.success = null;
        }
    },

    extraReducers: (builder) => {
        builder.addCase(staffLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(staffLogin.fulfilled, (state,action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload || action.payload.success;
            state.user = action.payload?.user || null;
            state.isAuthenticated = Boolean(action.payload?.user);
            console.log(state.user)

            localStorage.setItem("user", JSON.stringify(state.user));
            localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated));
            localStorage.setItem("token", action.payload.token);
        });
        builder.addCase(staffLogin.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload || action.payload.message || "Rejected";
            state.user = null;
            state.isAuthenticated = false

            if (action.payload?.statusCode === 401) {
                state.user = null;
                state.isAuthenticated = false;

                localStorage.removeItem("user");
                localStorage.removeItem("isAuthenticated");
            }
        });
    }

})

export const {removeErrors, removeSuccess} = authSlice.actions;
export default authSlice.reducer;