import express from "express";

const router = express.Router();

// temporary storage
let stories: any[] = [];

// create story
router.post("/", (req, res) => {
  const story = {
    id: Date.now().toString(),
    ...req.body,
  };

  stories.push(story);

  res.json({
    success: true,
    story,
  });
});

// get story by id
router.get("/:id", (req, res) => {
  const story = stories.find((s) => s.id === req.params.id);

  if (!story) {
    return res.status(404).json({
      success: false,
      message: "Story not found",
    });
  }

  res.json(story);
});

// list all stories
router.get("/", (req, res) => {
  res.json(stories);
});

export default router;