import jwt from "jsonwebtoken";
// import asyncHandler from "express-async-handler";
import User from "../Models/userModel.js";

const protect = async (req, res, next) => {
	let token;

	token = req.cookies.jwt;

	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			req.user = await User.findById(decoded.userId).select("-password");
			next();
		} catch (error) {
			next("Not authorized, token failed");
		}
	} else {
		next("Not authorized, no token");
	}
};

export { protect };
