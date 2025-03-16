// API Documentation
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
// Depandencies
import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Internal imports
import connectDB from "./Config/db.js";
import errorMiddelware from "./Middleware/errorMidleware.js";

//routes import
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import jobsRoutes from "./Routes/jobsRoutes.js";

// rest object
const app = express();

// config
dotenv.config();

// connect DB
connectDB();

// swagger api config
const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Job Portal API",
			version: "1.0.0",
			description: "Job portal API documentation",
		},
		servers: [
			{
				url: "https://job-portal-api-rr2a.onrender.com/api/v1",
			},
		],
	},
	apis: ["./Routes/*.js"],
};
const swaggerDocs = swaggerDoc(swaggerOptions);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/jobs", jobsRoutes);

// homeroute
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// validation middleware
app.use(errorMiddelware);

// PORT
const PORT = process.env.PORT || 8080;

// listening
app.listen(PORT, () => {
	console.log(
		`Node Server Running In ${process.env.DEV_MODE} Mode on port ${PORT}`
	);
});
