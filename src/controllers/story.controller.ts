import { Request, Response } from "express";
import mongoose from "mongoose";
import Story from "../models/story.model";
import { saveStory } from "../services/story.service";

export const getStories = async (
  req: Request,
  res: Response
) => {
  try {
    const stories = await Story.find({
      status: "approved",
      published: true,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: stories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch stories",
    });
  }
};

export const getMyStories = async (
  req: Request,
  res: Response
) => {
  try {
    const stories = await Story.find({
      userId: req.params.userId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: stories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user stories",
    });
  }
};

export const getMyDownloads = async (
  req: Request,
  res: Response
) => {
  try {
    const stories = await Story.find({
      downloadedBy: new mongoose.Types.ObjectId(req.params.userId),
    }).sort({
      updatedAt: -1,
    });

    res.json({
      success: true,
      data: stories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch downloaded stories",
    });
  }
};

export const getStoryById = async (
  req: Request,
  res: Response
) => {
  try {
    const story = await Story.findById(
      req.params.id
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    res.json({
      success: true,
      data: story,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch story",
    });
  }
};

export const publishStory = async (
  req: Request,
  res: Response
) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      {
        published: true,
      },
      { new: true }
    );

    res.json({
      success: true,
      data: story,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to publish story",
    });
  }
};

export const downloadStory = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required to download a story",
      });
    }

    const story = await Story.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { downloadedBy: userId }, // no-op if already downloaded by this user
        $inc: { downloadCount: 1 },
      },
      { new: true }
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    res.json({
      success: true,
      data: story,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to download story",
    });
  }
};

export const generateVideo = async (
  req: Request,
  res: Response
) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    story.videoStatus = "generating";
    await story.save();

    res.json({
      success: true,
      message: "Video generation started",
      data: story,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to start video generation",
    });
  }
};

export const approveStory = async (
  req: Request,
  res: Response
) => {
  console.log("APPROVE CONTROLLER HIT");
  console.log("Story ID:", req.params.id);
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      {
        published: true,
        approvedAt: new Date(),
      },
      { new: true }
    );

    res.json({
      success: true,
      data: story,
    });
  } catch (error) {
  console.error("APPROVE ERROR:", error);

  res.status(500).json({
    success: false,
    message:
      error instanceof Error ? error.message : "Unknown error",
  });
}
};

export const rejectStory = async (
  req: Request,
  res: Response
) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      {
        published: false,
        rejectionReason:
          req.body.reason || "Rejected by teacher",
      },
      { new: true }
    );

    res.json({
      success: true,
      data: story,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

export const createStory = async (
  req: Request,
  res: Response
) => {
  try {
    const story = await saveStory(req.body);

    res.status(201).json({
      success: true,
      data: story,
    });
  } catch (error) {
  console.error("SAVE STORY ERROR:");
  console.error(error);

  res.status(500).json({
    success: false,
    message:
      error instanceof Error ? error.message : "Unknown error",
  });
}
};