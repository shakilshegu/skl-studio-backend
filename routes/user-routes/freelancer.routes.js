import express from "express";
import { protect } from "../../middlewares/auth.js";
import {
  fetchAllFreelancers,
  fetchEquipmentsByFreelancerId,
  fetchFreelancerById,
  fetchHelpersByFreelancerId,
  fetchPackagesByFreelancerId,
  fetchServicesByFreelancerId,
} from "../../controllers/user/freelancer.controller.js";

const router = express.Router();

/**
 * @swagger
 * /aloka-api/user/freelancers:
 *   get:
 *     summary: Get all freelancers available for studio booking
 *     tags: [Freelancers]
 *     description: Retrieve a list of all freelancers who can be booked for studio projects
 *     responses:
 *       200:
 *         description: List of all available freelancers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 freelancers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Freelancer'
 *       404:
 *         description: No freelancers found
 *       500:
 *         description: Server error
 */
router.get("/", fetchAllFreelancers);

/**
 * @swagger
 * /aloka-api/user/freelancers/{id}:
 *   get:
 *     summary: Get freelancer profile by ID
 *     tags: [Freelancers]
 *     description: Retrieve detailed information about a specific freelancer for studio booking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Freelancer ID
 *     responses:
 *       200:
 *         description: Detailed freelancer profile information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 freelancer:
 *                   $ref: '#/components/schemas/Freelancer'
 *       404:
 *         description: Freelancer not found
 *       500:
 *         description: Server error
 */
router.get("/:id", fetchFreelancerById);

/**
 * @swagger
 * /aloka-api/user/freelancers/{freelancerId}/equipments:
 *   get:
 *     summary: Get all studio equipment offered by a freelancer
 *     tags: [Freelancer Resources]
 *     description: Retrieve a list of all studio equipment that can be booked from a specific freelancer
 *     parameters:
 *       - in: path
 *         name: freelancerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Freelancer ID
 *     responses:
 *       200:
 *         description: List of all equipment offered by the freelancer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 equipments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Equipment'
 *       500:
 *         description: Server error
 */
router.get("/:freelancerId/equipments", fetchEquipmentsByFreelancerId);

/**
 * @swagger
 * /aloka-api/user/freelancers/{freelancerId}/packages:
 *   get:
 *     summary: Get all studio booking packages offered by a freelancer
 *     tags: [Freelancer Resources]
 *     description: Retrieve a list of all booking packages that combine equipment and services from a specific freelancer
 *     parameters:
 *       - in: path
 *         name: freelancerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Freelancer ID
 *     responses:
 *       200:
 *         description: List of all studio packages offered by the freelancer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 packages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Package'
 *       500:
 *         description: Server error
 */
router.get("/:freelancerId/packages", fetchPackagesByFreelancerId);

/**
 * @swagger
 * /aloka-api/user/freelancers/{freelancerId}/services:
 *   get:
 *     summary: Get all studio services offered by a freelancer
 *     tags: [Freelancer Resources]
 *     description: Retrieve a list of all studio-related services that can be booked from a specific freelancer
 *     parameters:
 *       - in: path
 *         name: freelancerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Freelancer ID
 *     responses:
 *       200:
 *         description: List of all services offered by the freelancer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 services:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *       500:
 *         description: Server error
 */
router.get("/:freelancerId/services", fetchServicesByFreelancerId);

/**
 * @swagger
 * /aloka-api/user/freelancers/{freelancerId}/helpers:
 *   get:
 *     summary: Get all studio assistants/helpers offered by a freelancer
 *     tags: [Freelancer Resources]
 *     description: Retrieve a list of all assistants or helpers that can be booked along with the freelancer for studio sessions
 *     parameters:
 *       - in: path
 *         name: freelancerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Freelancer ID
 *     responses:
 *       200:
 *         description: List of all helpers/assistants offered by the freelancer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 helpers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Helper'
 *       500:
 *         description: Server error
 */
router.get("/:freelancerId/helpers", fetchHelpersByFreelancerId);

/**
 * @swagger
 * components:
 *   schemas:
 *     Freelancer:
 *       type: object
 *       required:
 *         - name
 *         - age
 *         - categories
 *         - location
 *         - experience
 *         - pricePerHour
 *         - profileImage
 *         - user
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the freelancer
 *         name:
 *           type: string
 *           description: The name of the freelancer
 *         age:
 *           type: number
 *           description: The age of the freelancer
 *         description:
 *           type: string
 *           description: The freelancer's bio and services description
 *         categories:
 *           type: string
 *           enum: [Web Development, Graphic Design, Content Writing, Digital Marketing, UI/UX Design]
 *           description: The category of studio work the freelancer specializes in
 *         location:
 *           type: string
 *           description: The freelancer's location for studio booking
 *         experience:
 *           type: number
 *           description: Years of experience in studio work
 *         pricePerHour:
 *           type: number
 *           description: Hourly rate charged by the freelancer for studio time
 *         profileImage:
 *           type: string
 *           description: URL to the freelancer's profile image
 *         user:
 *           type: string
 *           description: Reference to the User model
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the freelancer profile was created
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         name: John Doe
 *         age: 30
 *         description: Experienced photographer specializing in portrait and commercial photography
 *         categories: Graphic Design
 *         location: New York, USA
 *         experience: 5
 *         pricePerHour: 100
 *         profileImage: https://example.com/profile.jpg
 *         user: 60d21b4667d0d8992e610c80
 *         createdAt: 2023-05-09T14:30:00Z
 *     
 *     Equipment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         type:
 *           type: string
 *           description: Reference to equipment category
 *         name:
 *           type: string
 *           description: Name of the studio equipment
 *         description:
 *           type: string
 *           description: Detailed description of the equipment
 *         photo:
 *           type: string
 *           description: Image of the equipment
 *         price:
 *           type: number
 *           description: Rental price of the equipment
 *         isDeleted:
 *           type: boolean
 *           description: Whether the equipment is available for booking
 *         freelancerId:
 *           type: string
 *           description: Reference to the freelancer who owns this equipment
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *       example:
 *         _id: 60d21b4667d0d8992e610c86
 *         type: 60d21b4667d0d8992e610c90
 *         name: Sony Alpha a7 III
 *         description: Full-frame mirrorless camera with exceptional image quality
 *         photo: https://example.com/camera.jpg
 *         price: 150
 *         isDeleted: false
 *         freelancerId: 60d21b4667d0d8992e610c85
 *         reviews: [
 *           {
 *             user: 60d21b4667d0d8992e610c82,
 *             rating: 5,
 *             comment: "Equipment was in perfect condition",
 *             createdAt: "2023-05-10T10:30:00Z"
 *           }
 *         ]
 *     
 *     Package:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           description: Name of the studio package
 *         description:
 *           type: string
 *           description: Detailed description of what's included in the package
 *         price:
 *           type: number
 *           description: Total price for the package
 *         photo:
 *           type: string
 *           description: Featured image for the package
 *         isDeleted:
 *           type: boolean
 *           description: Whether the package is available for booking
 *         freelancerId:
 *           type: string
 *           description: Reference to the freelancer offering this package
 *         equipments:
 *           type: array
 *           description: Equipment included in this package
 *           items:
 *             type: string
 *         services:
 *           type: array
 *           description: Services included in this package
 *           items:
 *             type: string
 *       example:
 *         _id: 60d21b4667d0d8992e610c87
 *         name: Professional Portrait Session
 *         description: Complete portrait photography package with editing and prints
 *         price: 600
 *         photo: https://example.com/package.jpg
 *         isDeleted: false
 *         freelancerId: 60d21b4667d0d8992e610c85
 *         equipments: [60d21b4667d0d8992e610c86]
 *         services: [60d21b4667d0d8992e610c88]
 *     
 *     Service:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           description: Name of the studio service
 *         description:
 *           type: string
 *           description: Detailed description of the service
 *         price:
 *           type: number
 *           description: Price of the service
 *         photo:
 *           type: string
 *           description: Image representing the service
 *         isDeleted:
 *           type: boolean
 *           description: Whether the service is available for booking
 *         freelancerId:
 *           type: string
 *           description: Reference to the freelancer offering this service
 *       example:
 *         _id: 60d21b4667d0d8992e610c88
 *         name: Photo Editing
 *         description: Professional photo retouching and editing service
 *         price: 200
 *         photo: https://example.com/service.jpg
 *         isDeleted: false
 *         freelancerId: 60d21b4667d0d8992e610c85
 *     
 *     Helper:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           description: Name of the studio assistant
 *         description:
 *           type: string
 *           description: Assistant's role and qualifications
 *         price:
 *           type: number
 *           description: Hourly rate for the assistant
 *         isDeleted:
 *           type: boolean
 *           description: Whether the helper is available for booking
 *         freelancerId:
 *           type: string
 *           description: Reference to the freelancer who works with this assistant
 *       example:
 *         _id: 60d21b4667d0d8992e610c89
 *         name: Lighting Assistant
 *         description: Experienced lighting technician for studio photography
 *         price: 50
 *         isDeleted: false
 *         freelancerId: 60d21b4667d0d8992e610c85
 */

export default router;