import mongoose from "mongoose";


// job schema
const jobSchema = new mongoose.Schema(
	{
		company: {
			type: String,
			required: [true, "Company is required"],
		},
		position: {
			type: String,
			required: [true, "Position is required"],
		},
		status: {
			type: String,
			enum: ["pending", "interview", "declined"],
			default: "pending",
		},
		jobType: {
			type: String,
			enum: ["full-time", "part-time", "remote", "internship"],
			default: "full-time",
		},
		jobLocation: {
			type: String,
			default: "my city",
			required: true,
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: [true, "Please provide user"],
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Job", jobSchema);
