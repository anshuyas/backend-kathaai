import express from "express";
import { approveStory, dashboard, rejectStory } from "../controllers/teacher.controller";

const router = express.Router();

router.get("/dashboard", dashboard);
router.patch("/story/:id/approve", approveStory);

router.patch("/story/:id/reject", rejectStory);

export default router;