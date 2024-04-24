import Express from "express";

// router object
const router = Express.Router();

import { protect } from "../Middleware/authMiddleware.js";
import {
	createJobController,
	getJobController,
	updateJobController,
	deleteJobController,
	jobStatsController,
} from "../Controller/jobsController.js";

// Routes
router.post("/create-job", protect, createJobController);
router.get("/get-jobs", protect, getJobController);
router.patch("/update-job/:id", protect, updateJobController);
router.delete("/delete-job/:id", protect, deleteJobController);
router.get("/job-stats", protect, jobStatsController);

/**
 * @swagger
 * components:
 *  schemas:
 *    Job:
 *      type: object
 *      required:
 *        - company
 *        - position
 *        - jobLocation
 *        - createdBy
 *      properties:
 *        id:
 *          type: string
 *          description: The Auto-generated id of user collection
 *        company:
 *          type: string
 *          description: The name of company
 *        position:
 *          type: string
 *          description: The name of position
 *        status:
 *          type: string
 *          description: The status of job
 *        jobType:
 *          type: string
 *          description: The type of job
 *        jobLocation:
 *          type: string
 *          description: The location of job
 *        createdBy:
 *          type: string
 *          description: The id of user
 *      example :
 *        id: DHSASDHJDJHVAJDSVJAVSD
 *        company: Google
 *        position: Frontend Developer
 *        status: pending
 *        jobType: full-time
 *        jobLocation: my city
 *        createdBy: DHSASDHJDJHVAJDSVJAVSD
 */

/**
 * @swagger
 * tags:
 *  name: Jobs
 *  description: Jobs managing API
 */

/**
 * @swagger
 * /jobs/create-job:
 *    post:
 *      summary: create new job
 *      tags: [Jobs]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *      responses:
 *        201:
 *          description: job created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Job'
 *        500:
 *          description: internal serevr error
 *
 */

/**
 * @swagger
 * /jobs/get-jobs:
 *    get:
 *      summary: get jobs
 *      tags: [Jobs]
 *      responses:
 *        200:
 *          description: get all jobs
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Job'
 *        500:
 *          description: internal serevr error
 */

/**
 * @swagger
 * /jobs/update-job/{id}:
 *    patch:
 *      summary: update job
 *      tags: [Jobs]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *      responses:
 *        200:
 *          description: job updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Job'
 *        500:
 *          description: internal serevr error
 */

/**
 * @swagger
 * /jobs/delete-job/{id}:
 *    delete:
 *      summary: delete job
 *      tags: [Jobs]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *      responses:
 *        200:
 *          description: job deleted successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Job'
 *        500:
 *          description: internal serevr error
 */

/**
 * @swagger
 * /jobs/job-stats:
 *    get:
 *      summary: get job stats
 *      tags: [Jobs]
 *      responses:
 *        200:
 *          description: get job stats
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Job'
 *        500:
 *          description: internal serevr error
 */

// export router
export default router;
