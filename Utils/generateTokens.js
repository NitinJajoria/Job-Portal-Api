import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});

	res.cookie("jwt", token, {
		httpOnly: true,
		secure: process.env.DEV_MODE !== "development", // Use secure cookies in production
		sameSite: "strict", // Prevent CSRF attacks
		maxAge: 24 * 60 * 60 * 1000, // 1 days
	});
};

export default generateToken;
