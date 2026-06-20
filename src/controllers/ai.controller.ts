import { Request, Response } from "express";
import { generateStory } from "../services/ai.service";
import { saveStory } from "../services/story.service";

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
const savedStory = await saveStory({
  title: result.title,
  language,
  ageGroup,
  storyLength,
  genre,
  learningGoal,

  scenes: result.scenes,
  quiz: result.quiz,

  heroName,
  heroVoice,
});
console.log("SAVED STORY:", savedStory);
    res.json({
      success: true,
      message: "Story generated successfully",
      data: savedStory
    });
  } catch (error) {
    console.log("AI ERROR:", error);

    res.status(500).json({
      success: false,
      message: "AI story generation failed"
    });
  }
};