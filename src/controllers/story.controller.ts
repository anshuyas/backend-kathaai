import { Request, Response } from "express";
import Story from "../models/story.model";

export const getStories = async (
  req: Request,
  res: Response
) => {
  try {
    const stories = await Story.find().sort({
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
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      {
        downloaded: true,
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
      message: "Failed to download story",
    });
  }
};