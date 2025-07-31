import express from "express";
import { 
  getAllTeamMembers, 
  getTeamMemberById, 
  createTeamMember, 
  updateTeamMember,
  deleteTeamMember 
} from "../../controllers/partner/teamMember.Controller.js";
import { protect } from "../../middlewares/auth.js";
import  upload  from "../../middlewares/multer.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Team Members
 *   description: Studio team member management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TeamMember:
 *       type: object
 *       required:
 *         - name
 *         - role
 *         - studioId
 *         - image
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the team member
 *         studioId:
 *           type: string
 *           description: ID of the studio this team member belongs to
 *         name:
 *           type: string
 *           description: Name of the team member
 *         role:
 *           type: string
 *           description: Role or position of the team member
 *         mobile:
 *           type: string
 *           description: Mobile number of the team member
 *         email:
 *           type: string
 *           description: Email address of the team member
 *         description:
 *           type: string
 *           description: Description or bio of the team member
 *         image:
 *           type: string
 *           description: URL of the team member's photo
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the team member was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the team member was last updated
 */

/**
 * @swagger
 * /aloka-api/partner/team-member:
 *   get:
 *     summary: Get all team members
 *     tags: [Team Members]
 *     responses:
 *       200:
 *         description: List of all team members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamMember'
 *       500:
 *         description: Failed to fetch team members
 */
router.get("/",protect, getAllTeamMembers);

/**
 * @swagger
 * /aloka-api/partner/team-member/{id}:
 *   get:
 *     summary: Get a single team member by ID
 *     tags: [Team Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member ID
 *     responses:
 *       200:
 *         description: Team member details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamMember'
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Error retrieving team member
 */
router.get("/:id", getTeamMemberById);

/**
 * @swagger
 * /aloka-api/partner/team-member:
 *   post:
 *     summary: Create a new team member
 *     tags: [Team Members]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - role
 *               - photo
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the team member
 *               role:
 *                 type: string
 *                 description: Role or position of the team member
 *               mobile:
 *                 type: string
 *                 description: Mobile number of the team member
 *               email:
 *                 type: string
 *                 description: Email address of the team member
 *               description:
 *                 type: string
 *                 description: Description or bio of the team member
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Team member's photo
 *     responses:
 *       201:
 *         description: Team member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamMember'
 *       400:
 *         description: Failed to create team member
 *       404:
 *         description: Photo required or Studio not found
 */
router.post("/", protect, upload.single("photo"), createTeamMember);

/**
 * @swagger
 * /aloka-api/partner/team-member/{id}:
 *   put:
 *     summary: Update a team member
 *     tags: [Team Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the team member
 *               role:
 *                 type: string
 *                 description: Role or position of the team member
 *               mobile:
 *                 type: string
 *                 description: Mobile number of the team member
 *               email:
 *                 type: string
 *                 description: Email address of the team member
 *               description:
 *                 type: string
 *                 description: Description or bio of the team member
 *     responses:
 *       200:
 *         description: Team member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamMember'
 *       400:
 *         description: Failed to update team member
 *       404:
 *         description: Team member not found
 */
router.put("/:id", protect, updateTeamMember);

/**
 * @swagger
 * /aloka-api/partner/team-member/{id}:
 *   delete:
 *     summary: Delete a team member
 *     tags: [Team Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member ID
 *     responses:
 *       200:
 *         description: Team member deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Team member deleted successfully
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Failed to delete team member
 */
router.delete("/:id", protect, deleteTeamMember);

export default router;