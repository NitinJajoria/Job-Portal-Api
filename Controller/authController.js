import User from "../Models/userModel.js";
import generateToken from "../Utils/generateTokens.js";

// @desc Register new user
// @route POST /api/v1/auth/register
// @access Public
const registerController = async (req, res, next) => {
	const { name, lastName, email, password, location } = req.body;

	// validation
	if (!name) {
		next("name is required");
	}
	if (!email) {
		next("email is required");
	}
	if (!password) {
		next("password is required and greater than 6 character");
	}

	// check if user already exists
	const user = await User.findOne({ email });
	if (user) {
		next("Email Already Register Please Login");
	}

	// register user
	const newUser = await User.create({
		name,
		lastName,
		email,
		password,
		location,
	});

	if (newUser) {
		generateToken(res, newUser._id);
		return res.status(201).send({
			success: true,
			message: "User created successfully",
			user: {
				name: newUser.name,
				lastName: newUser.lastName,
				email: newUser.email,
				location: newUser.location,
			},
		});
	}
};

// @desc Login user
// @route POST /api/v1/auth/login
// @access Public
const loginController = async (req, res, next) => {
	const { email, password } = req.body;

	// validation
	if (!email || !password) {
		next("Please Provide All Fields");
	}

	//find user by email
	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		next("Invalid Useraname or password");
	}

	// check password
	const isMatch = await user.comparePassword(password);
	if (!isMatch) {
		next("Invalid Useraname or password");
	}

	if (user && isMatch) {
		generateToken(res, user._id);

		res.status(200).send({
			success: true,
			message: "Login successful",
			user: { _id: user._id, name: user.name, email: user.email },
		});
	}
};

export { registerController, loginController };
