import { Request, Response } from "express";
import {
  startReading,
  finishReading,
} from "../services/reading.service";

export const startStory = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, storyId } = req.body;

    const session = await startReading(
      userId,
      storyId
    );

    res.json({
      success: true,
      data: session,
    });
  } catch {
    res.status(500).json({
      success: false,
    });
  }
};

export const finishStory = async (
  req: Request,
  res: Response
) => {
  try {
    const { sessionId, duration } = req.body;

    const session = await finishReading(
      sessionId,
      duration
    );

    res.json({
      success: true,
      data: session,
    });
  } catch {
    res.status(500).json({
      success: false,
    });
  }
};