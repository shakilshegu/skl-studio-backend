import express from "express";
// import { protect} from "../../middlewares/auth.js";
import { 
  fetchAllStudio,
  approveStudio,
  blockStudio,
  getStudioById
} from "../../controllers/admin/studio.controller.js";

const router = express.Router();

// Studio management routes
router.get("/", fetchAllStudio);
router.get("/:id", getStudioById);
router.put("/:id/approve", approveStudio);
router.put("/:id/block", blockStudio);

export default router;