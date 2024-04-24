import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

// user schema
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		lastName: {
			type: String,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			validate: [validator.isEmail, "Please provide a valid email"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password length should be greater than 6 character"],
			select: true,
		},
		location: {
			type: String,
			default: "India",
		},
	},
	{ timestamps: true }
);

// middelwares
userSchema.pre("save", async function () {
	if (!this.isModified) return;
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

//compare password
userSchema.methods.comparePassword = async function (userPassword) {
	const isMatch = await bcrypt.compare(userPassword, this.password);
	return isMatch;
};

// user model
const User = mongoose.model("User", userSchema);

export default User;
