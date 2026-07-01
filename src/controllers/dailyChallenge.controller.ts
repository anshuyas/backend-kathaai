import { Request, Response } from "express";
import { getTodayChallenge } from "../services/dailyChallenge.service";

export const todayChallenge = async (
  req: Request,
  res: Response
) => {
  try {
    const challenge = await getTodayChallenge();

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "No daily challenge available",
      });
    }

    res.json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load daily challenge",
    });
  }
};