import { check } from "express-validator";

export const equipmentCategory = [
    check('name', 'Name is required').notEmpty(),
    check('description', 'Description must be valid').optional().isString(),
];