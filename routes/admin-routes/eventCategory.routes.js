// routes/eventCategoryRoutes.js
import express from "express";
// import { protect } from "../../middlewares/auth.js";
import upload from "../../middlewares/multer.js";
import {
  createEventCategory,
  getAllEventCategories,
  updateEventCategory,
  deleteEventCategory,
} from "../../controllers/admin/eventCategory.controller.js";
const router = express.Router();

router.post("/", upload.single("image"), createEventCategory);

router.get("/", getAllEventCategories);

router.put("/:id", upload.single("image"), updateEventCategory);

router.delete("/:id", deleteEventCategory);

export default router;
