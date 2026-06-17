import { Request, Response } from "express";
import { generateStory } from "../services/ai.service";

export const createStory = async (req: Request, res: Response) => {
  try {
    const {
  prompt,
  language,
  ageGroup,
  storyLength,
  genre,
  learningGoal,
  heroName,
  heroVoice,
} = req.body;

const result = await generateStory(
  prompt,
  language,
  ageGroup,
  storyLength,
  genre,
  learningGoal,
  heroName,
  heroVoice
);
    res.json({
      success: true,
      message: "Story generated successfully",
      data: result
    });
  } catch (error) {
    console.log("AI ERROR:", error);

    res.status(500).json({
      success: false,
      message: "AI story generation failed"
    });
  }
};