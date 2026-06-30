import { Request, Response } from "express";
import { generateStory } from "../services/ai.service";
import { saveStory } from "../services/story.service";
import { generateImage } from "../services/image.service";

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
  userId,
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
for (const scene of result.scenes) {
  const { imageUrl } = await generateImage(
    scene.visualPrompt
  );

  scene.imageUrl = imageUrl;
}
const savedStory = await saveStory({
  title: result.title,
  userId,
  language,
  ageGroup,
  storyLength,
  genre,
  learningGoal,

  scenes: result.scenes,
  quiz: result.quiz,

  heroName,
  heroVoice,

  status: "generated",
  published: false,
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