import User from "../Models/userModel.js";
import generateToken from "../Utils/generateTokens.js";

// @desc update user profile
// @route PUT /api/v1/user/update-user
// @access Private
const updateUserController = async (req, res) => {
	const { name, lastName, email, location, password } = req.body;
	if (!name || !lastName || !email || !location || !password) {
		next("Please Provide All Fields");
	}

	const user = await User.findById({ _id: req.user._id });

	if (!user) {
		next("Invalid Useraname or password");
	}
	user.name = name;
	user.lastName = lastName;
	user.email = email;
	user.location = location;
	user.password = password;

	await user.save();
	if (user) {
		generateToken(res, user._id);

		res.status(200).send({
			success: true,
			message: "Profile updated successful",
			user: {
				_id: user._id,
				name: user.name,
				lastName: user.lastName,
				email: user.email,
				location: user.location,
			},
		});
	}
};

export { updateUserController };
