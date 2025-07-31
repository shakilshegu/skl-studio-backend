import express from "express";
// import { protect } from "../../middlewares/auth.js";
import upload from "../../middlewares/multer.js";
import {
  createStudioCategory,
  getAllStudioCategories,
  updateStudioCategory,
  deleteStudioCategory,
} from "../../controllers/admin/studioCategory.controller.js";

const router = express.Router();

router.post("/", upload.single("image"), createStudioCategory);
router.get("/", getAllStudioCategories);
router.put("/:id", upload.single("image"), updateStudioCategory);
router.delete("/:id", deleteStudioCategory);

export default router;
