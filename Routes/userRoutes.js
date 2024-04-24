import Express from "express";
import { updateUserController } from "../Controller/userController.js";
import { protect } from "../Middleware/authMiddleware.js";

// router object
const router = Express.Router();

// Routes
router.put("/update-user", protect, updateUserController);

/**
 * @swagger
 * tags:
 *  name: User
 *  description: User managing API
 */

/**
 * @swagger
 * /user/update-user:
 *    put:
 *      summary: update user
 *      tags: [User]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: user updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        500:
 *          description: internal serevr error
 */

// export router
export default router;
