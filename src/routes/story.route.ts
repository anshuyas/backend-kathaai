import express from "express";
import {
  getStories,
  getStoryById,
  publishStory,
  downloadStory,
} from "../controllers/story.controller";

const router = express.Router();

router.get("/", getStories);

router.get(
  "/:id",
  getStoryById
);

router.patch(
  "/:id/publish",
  publishStory
);

router.patch(
  "/:id/download",
  downloadStory
);

export default router;