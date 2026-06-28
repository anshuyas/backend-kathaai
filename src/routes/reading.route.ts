import express from "express";

import {
  startStory,
  finishStory,
} from "../controllers/reading.controller";

const router = express.Router();

router.post("/start", startStory);

router.post("/finish", finishStory);

export default router;