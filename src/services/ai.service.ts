import { model } from "../config/gemini.config";

export const generateStory = async (userPrompt: string) => {
  try {
    const prompt = `
You are an AI storyteller for Nepali children.

Convert the user input into a structured animated story.

RULES:
- Use simple language (Nepali + English mix)
- Make it child-friendly
- Include Nepali culture, places, festivals when possible
- Break story into 4–6 scenes
- Output MUST be valid JSON only (no markdown, no explanation)

Return this exact format:

{
  "title": "string",
  "language": "mixed",
  "scenes": [
    {
      "sceneNo": 1,
      "text": "string",
      "visualPrompt": "string for image generation",
      "emotion": "happy | sad | excited | neutral",
      "audioNarration": "string"
    }
  ],
  "quiz": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "answer": "A"
    }
  ]
}

User input:
${userPrompt}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = response.text();

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON Parse Error:", cleaned);
      throw new Error("AI returned invalid JSON");
    }

  } catch (error) {
    console.error("AI SERVICE ERROR:", error);
    throw new Error("AI story generation failed");
  }
};