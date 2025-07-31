import express from "express";
import studioCategoryRouter from "./admin-routes/studioCategory.routes.js";
import eventCategoryRouter from "./admin-routes/eventCategory.routes.js";
import studioRouter from "./admin-routes/studio.routes.js";
import packageRouter from "./admin-routes/package.routes.js";
const router = express.Router();

router.use('/studio-category',studioCategoryRouter)
router.use('/event-category',eventCategoryRouter)
router.use('/studios',studioRouter)
router.use('/packages',packageRouter)


export  default router