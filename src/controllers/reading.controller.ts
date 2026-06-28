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

    const session = await startReading(userId, storyId);

    console.log("SESSION CREATED:", session);

    return res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("START READING ERROR:", error);

    return res.status(500).json({
      success: false,
      error,
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
  } catch (error) {
    console.error("FINISH READING ERROR:", error);

    res.status(500).json({
      success: false,
      error,
    });
  }
};