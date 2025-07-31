//  api/partner/equipmentCategories

import express from 'express';
import {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} from '../../controllers/partner/equipmentCategory.Controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: EquipmentCategories
 *   description: API for managing equipment categories
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the category
 *         name:
 *           type: string
 *           description: The name of the category
 *         description:
 *           type: string
 *           description: The description of the category
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the category was created
 */

/**
 * @swagger
 * /api/partner/equipmentCategories:
 *   get:
 *     summary: Get all categories
 *     tags: [EquipmentCategories]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', getAllCategories);

/**
 * @swagger
 * /api/partner/equipmentCategories:
 *   post:
 *     summary: Add a new category
 *     tags: [EquipmentCategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request
 */
router.post('/', addCategory);

/**
 * @swagger
 * /api/partner/equipmentCategories/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [EquipmentCategories]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Category not found
 */
router.put('/:id', updateCategory);

/**
 * @swagger
 * /api/partner/equipmentCategories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [EquipmentCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted category
 *       404:
 *         description: Category not found
 */
router.delete('/:id', deleteCategory);

export default router;
