import { Request, Response } from "express";
import { saveQuizResult } from "../services/user.service";

export const saveQuizScore = async (
  req: Request,
  res: Response
) => {
  try {
    const { sessionId, score, pointsEarned } = req.body;

    const session = await saveQuizResult(
      sessionId,
      score,
      pointsEarned
    );

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to save quiz score",
    });
  }
};