import express from "express";
import {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  hardDeletePackage,
  restorePackage,
} from "../../controllers/admin/package.controller.js";
import upload from "../../middlewares/multer.js";

const router = express.Router();

router.route("/").get(getAllPackages).post(upload.single("photo"), createPackage);
router
  .route("/:id")
  .get(getPackageById)
  .put(upload.single("photo"), updatePackage)
  .delete(deletePackage);

router.route("/:id/hard").delete(hardDeletePackage);

router.route("/:id/restore").put(restorePackage);

export default router;
