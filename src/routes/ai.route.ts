import { Router } from "express";
import { createStory } from "../controllers/ai.controller";

const router = Router();

router.post("/generate-story", createStory);

export default router;