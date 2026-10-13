import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import errorHandler from "./middleware/error.js";


import routes from "./routes/index.js";
import { initAllSchemas } from "./schemas/index.js";


dotenv.config();



const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Backend Testing Successfully",
    })
})

app.use("/api/",routes)

// Unhandled Route (404)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

app.use(errorHandler)


initAllSchemas().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    })
}).catch((err) => {
    console.error("Failed to initialize database schemas:", err);
});
