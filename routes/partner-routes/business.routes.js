import express from "express";
import {
  createBusinessProfile,
  getMyBusinessProfile,
  updateBusinessProfile,
  getAllBusinessProfiles,
  deleteBusinessProfile,
} from "../../controllers/partner/businessInfo.Controller.js";
import { protect, authorizeRoles } from "../../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Business Profile
 *   description: Business profile management endpoints
 */

/**
 * @swagger
 * /aloka-api/partner/business:
 *   post:
 *     summary: Create a new business profile
 *     tags: [Business Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vendorName
 *             properties:
 *               vendorName:
 *                 type: string
 *                 description: Name of the vendor/business
 *               vendorType:
 *                 type: string
 *                 default: Freelancer
 *                 description: Type of vendor (Freelancer, Agency, etc.)
 *               teamSize:
 *                 type: number
 *                 description: Size of the team
 *               country:
 *                 type: string
 *                 default: India
 *                 description: Country of operation
 *               state:
 *                 type: string
 *                 description: State of operation
 *               city:
 *                 type: string
 *                 description: City of operation
 *               instagramHandle:
 *                 type: string
 *                 description: Instagram handle
 *               categoriesSpecialized:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Categories the business specializes in
 *               equipmentList:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of equipment used
 *               avgBookingDays:
 *                 type: number
 *                 description: Average number of days per booking
 *               inHouseDesigner:
 *                 type: boolean
 *                 description: Whether the business has in-house designers
 *               traveledOutsideCountry:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the business has traveled outside the country
 *               countriesTraveled:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of countries traveled to
 *               eventsOutsideCountry:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Events handled outside the country
 *               traveledOutsideCity:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the business has traveled outside the city
 *               citiesTraveled:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of cities traveled to
 *               eventsOutsideCity:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Events handled outside the city
 *               openToTravel:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the business is open to travel
 *     responses:
 *       201:
 *         description: Business profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Business profile created successfully
 *                 data:
 *                   type: object
 *                   description: Created business profile data
 *                 role:
 *                   type: string
 *                   description: User's updated role
 *       400:
 *         description: Business profile already exists for this user
 *       500:
 *         description: Server error
 */
router.post("/", protect, createBusinessProfile);

/**
 * @swagger
 * /aloka-api/partner/business/me:
 *   get:
 *     summary: Get current user's business profile
 *     tags: [Business Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Business profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Business profile data
 *       404:
 *         description: Business profile not found
 *       500:
 *         description: Server error
 */
router.get("/me", protect, getMyBusinessProfile);

/**
 * @swagger
 * /aloka-api/partner/business/{id}:
 *   put:
 *     summary: Update a business profile
 *     tags: [Business Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Business profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vendorName:
 *                 type: string
 *               vendorType:
 *                 type: string
 *               teamSize:
 *                 type: number
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               instagramHandle:
 *                 type: string
 *               categoriesSpecialized:
 *                 type: array
 *                 items:
 *                   type: string
 *               equipmentList:
 *                 type: array
 *                 items:
 *                   type: string
 *               avgBookingDays:
 *                 type: number
 *               inHouseDesigner:
 *                 type: boolean
 *               traveledOutsideCountry:
 *                 type: boolean
 *               countriesTraveled:
 *                 type: array
 *                 items:
 *                   type: string
 *               eventsOutsideCountry:
 *                 type: array
 *                 items:
 *                   type: string
 *               traveledOutsideCity:
 *                 type: boolean
 *               citiesTraveled:
 *                 type: array
 *                 items:
 *                   type: string
 *               eventsOutsideCity:
 *                 type: array
 *                 items:
 *                   type: string
 *               openToTravel:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Business profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Business profile updated successfully
 *                 data:
 *                   type: object
 *                   description: Updated business profile data
 *       404:
 *         description: Business profile not found or not authorized
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, updateBusinessProfile);

/**
 * @swagger
 * /aloka-api/partner/business:
 *   get:
 *     summary: Get all business profiles (admin only)
 *     tags: [Business Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: vendorType
 *         schema:
 *           type: string
 *         description: Filter by vendor type
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter by state
 *     responses:
 *       200:
 *         description: List of business profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   description: Number of profiles returned
 *                 total:
 *                   type: integer
 *                   description: Total number of profiles
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Business profile
 *       500:
 *         description: Server error
 */
router.get("/", protect, getAllBusinessProfiles);

/**
 * @swagger
 * /aloka-api/partner/business/{id}:
 *   delete:
 *     summary: Delete a business profile
 *     tags: [Business Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Business profile ID
 *     responses:
 *       200:
 *         description: Business profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Business profile deleted successfully
 *       404:
 *         description: Business profile not found or not authorized
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deleteBusinessProfile);

export default router;
