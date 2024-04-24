import jobsModel from "../Models/jobsModel.js";
import mongoose from "mongoose";
import moment from "moment";

// @desc Create new job
// @route POST /api/v1/jobs/create-job
// @access Private
const createJobController = async (req, res, next) => {
	const { company, position } = req.body;
	if (!company || !position) {
		next("Please Provide All Fields");
	}

	req.body.createdBy = req.user._id;

	const job = await jobsModel.create(req.body);

	res.status(201).send({
		success: true,
		message: "Job created successfully",
		job,
	});
};

// @desc Get jobs
// @route GET /api/v1/jobs/get-job
// @access Private
const getJobController = async (req, res, next) => {
	const { status, workType, search, sort } = req.query;

	// conditions for searching filters
	const queryObject = {
		createdBy: req.user._id,
	};

	//logic filters
	if (status && status !== "all") {
		queryObject.status = status;
	}
	if (workType && workType !== "all") {
		queryObject.workType = workType;
	}
	if (search) {
		queryObject.position = { $regex: search, $options: "i" };
	}

	let queryResult = jobsModel.find(queryObject);

	//sorting
	if (sort === "latest") {
		queryResult = queryResult.sort("-createdAt");
	}
	if (sort === "oldest") {
		queryResult = queryResult.sort("createdAt");
	}
	if (sort === "a-z") {
		queryResult = queryResult.sort("position");
	}
	if (sort === "z-a") {
		queryResult = queryResult.sort("-position");
	}

	//pagination
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;

	queryResult = queryResult.skip(skip).limit(limit);

	//jobs count
	const totalJobs = await jobsModel.countDocuments(queryResult);
	const numOfPage = Math.ceil(totalJobs / limit);

	const jobs = await queryResult;

	// const jobs = await jobsModel.find({ createdBy: req.user._id });
	res.status(200).json({
		totalJobs,
		jobs,
		numOfPage,
	});
};

// @desc Update job
// @route PATCH /api/v1/jobs/update-job/:id
// @access Private
const updateJobController = async (req, res, next) => {
	const { id } = req.params;
	const { company, position } = req.body;
	//validation
	if (!company || !position) {
		next("Please Provide All Fields");
	}
	//find job
	const job = await jobsModel.findOne({ _id: id });
	//validation
	if (!job) {
		next(`no jobs found with this id ${id}`);
	}
	// console.log(
	// 	"user",
	// 	req.user._id.toString(),
	// 	"createdBy",
	// 	job.createdBy.toString()
	// );
	if (req.user._id.toString() === job.createdBy.toString()) {
		const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
			runValidators: true,
		});
		//res
		res.status(200).json({ updateJob });
	} else {
		next("You are Not Authorized to update this job");
		return;
	}
};

// @desc Delete job
// @route DELETE /api/v1/jobs/delete-job/:id
// @access Private
const deleteJobController = async (req, res, next) => {
	const { id } = req.params;
	//find job
	const job = await jobsModel.findOne({ _id: id });
	//validation
	if (!job) {
		next(`No Job Found With This ID ${id}`);
	}
	if (!req.user._id.toString() === job.createdBy.toString()) {
		next("Your Not Authorize to delete this job");
		return;
	}
	await job.deleteOne();
	res.status(200).json({ message: "Success, Job Deleted!" });
};

// @desc Get job stats
// @route GET /api/v1/jobs/job-stats
// @access Private
const jobStatsController = async (req, res) => {
	const stats = await jobsModel.aggregate([
		{
			$match: {
				createdBy: req.user._id,
			},
		},
		{
			$group: {
				_id: "$status",
				count: { $sum: 1 },
			},
		},
	]);

	// Create a map to easily retrieve counts based on status
	const statusMap = stats.reduce((map, item) => {
		map[item._id] = item.count;
		return map;
	}, {});

	// Assign counts to defaultStats, using a fallback of 0 if the status is missing
	const defaultStats = {
		pending: statusMap["pending"] || 0,
		reject: statusMap["reject"] || 0,
		interview: statusMap["interview"] || 0,
	};

	//monthly yearly stats
	let monthlyApplication = await jobsModel.aggregate([
		{
			$match: {
				createdBy: req.user._id,
			},
		},
		{
			$group: {
				_id: {
					year: { $year: "$createdAt" },
					month: { $month: "$createdAt" },
				},
				count: {
					$sum: 1,
				},
			},
		},
	]);
	monthlyApplication = monthlyApplication
		.map((item) => {
			const {
				_id: { year, month },
				count,
			} = item;
			const date = moment()
				.month(month - 1)
				.year(year)
				.format("MMM Y");
			return { date, count };
		})
		.reverse();
	res
		.status(200)
		.json({ totalJobs: stats.length, defaultStats, monthlyApplication });
};

export {
	createJobController,
	getJobController,
	updateJobController,
	deleteJobController,
	jobStatsController,
};
