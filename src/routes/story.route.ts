import express from "express";
import {
  getStories,
  getStoryById,
  getMyStories,
  getMyDownloads,
  publishStory,
  downloadStory,
  generateVideo,
  approveStory,
  rejectStory,
  createStory,
} from "../controllers/story.controller";
import Story from "../models/story.model";

const router = express.Router();

router.get("/my/:userId", getMyStories);

router.get("/downloads/:userId", getMyDownloads);  

router.get("/", getStories);

router.post("/save", createStory);

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

router.post(
  "/:id/generate-video",
  generateVideo
);

// Student: submit story for approval
router.patch("/:id/submit", async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { status: "pending_approval" },
      { new: true }
    );
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json({ success: true, data: story });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Teacher: get all stories pending approval
router.get("/pending", async (req, res) => {
  try {
    const stories = await Story.find({ status: "pending_approval" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: stories });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Teacher: approve a story
router.patch("/:id/approve", async (req, res) => {
  try {
    const { teacherId } = req.body;
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        published: true,
        approvedBy: teacherId,
        approvedAt: new Date(),
        rejectionReason: "",
      },
      { new: true }
    );
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json({ success: true, data: story });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Teacher: reject a story
router.patch("/:id/reject", async (req, res) => {
  try {
    const { reason } = req.body;
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        published: false,
        rejectionReason: reason || "Not suitable for publishing.",
      },
      { new: true }
    );
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json({ success: true, data: story });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id/approve", approveStory);

router.patch("/:id/reject", rejectStory);

export default router;

