// import express from 'express';
// import {
//   getHelpers,
//   createHelper,
//   updateHelper,
//   deleteHelper,
// } from '../../controllers/partner/helper.Controller.js';

// const router = express.Router();

// router.get('/', getHelpers);              
// router.post('/', createHelper);             
// router.put('/:id', updateHelper);          
// router.delete('/:id', deleteHelper);      

// export default router;


// routes/partner/helper.Routes.js
import express from 'express';
import {
  getHelpers,
  createHelper,
  updateHelper,
  deleteHelper,
} from '../../controllers/partner/helper.Controller.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/partner/helper:
 *   get:
 *     summary: Get all helpers
 *     tags: [Helper]
 *     responses:
 *       200:
 *         description: List of helpers
 */
router.get('/', getHelpers);

/**
 * @swagger
 * /api/partner/helper:
 *   post:
 *     summary: Create a new helper
 *     tags: [Helper]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Helper created
 */
router.post('/',protect, createHelper);

/**
 * @swagger
 * /api/partner/helper/{id}:
 *   put:
 *     summary: Update a helper
 *     tags: [Helper]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Helper updated
 */
router.put('/:id',protect, updateHelper);

/**
 * @swagger
 * /api/partner/helper/{id}:
 *   delete:
 *     summary: Delete a helper
 *     tags: [Helper]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Helper deleted
 */
router.delete('/:id',protect, deleteHelper);

export default router;
