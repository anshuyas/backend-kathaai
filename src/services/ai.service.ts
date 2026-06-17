import { model } from "../config/gemini.config";

export const generateStory = async (
  userPrompt: string,
  language: string,
  ageGroup: string,
  storyLength: string,
  genre: string,
  learningGoal: string,
  heroName: string,
  heroVoice: string,
) => {
  try {
    const prompt = `
You are an AI storyteller for children.

Convert the user input into a structured animated story.

LANGUAGE RULES:

If language is "English":
- Generate EVERYTHING in English.
- Do not use Nepali words.
- Do not use Devanagari script.

If language is "Nepali":
- Generate EVERYTHING in Nepali.
- Use proper Devanagari script (नेपाली लिपि).
- Do NOT write Nepali using English letters.
- Do NOT mix English words into the story.
- Title, scenes, quiz questions, options, and narration must all be in Nepali.

HERO SETTINGS:

Hero Name: ${heroName}
Hero Voice: ${heroVoice}

HERO RULES:
- The main character MUST be named "${heroName}".
- Never replace the hero with another name.
- Use the selected hero throughout the story.
- The hero should be central to every scene.

STORY SETTINGS:

Language: ${language}
Age Group: ${ageGroup}
Story Length: ${storyLength}
Genre: ${genre}
Learning Goal: ${learningGoal}

ADAPTATION RULES:

Age Group:
- 5-9 years → very simple vocabulary, short sentences, playful tone.
- 10-14 years → moderate vocabulary, more adventure and learning.
- 15-18 years → richer storytelling and deeper themes.

Story Length:
- Short → 4 scenes.
- Medium → 6 scenes.
- Long → 8-10 scenes.

Genre:
- Adventure → exciting journey and exploration.
- Fantasy → magical creatures and magical events.
- Science → scientific concepts explained through story.
- Festival → centered around Nepali festivals and traditions.
- Funny → humorous events and characters.
- Moral → strong moral lesson.
- Historical → inspired by history and culture.
- Comic → lighthearted and entertaining.

Learning Goal:
- Life Skills → practical everyday lessons.
- Character → focus on personal growth.
- Problem Solving → characters solve challenges logically.
- Leadership → leadership and teamwork.
- Kindness → empathy and helping others.
- Culture → teach Nepali culture and traditions.
- Mindfulness → emotional awareness and calm thinking.
- Social → friendship and communication.
- Values → honesty, respect, responsibility and integrity.

OTHER RULES:
- Make it child-friendly.
- Include Nepali culture, places, festivals when appropriate.
- Output MUST be valid JSON only.
- No markdown.
- No explanations.

Return this exact format:

{
  "title": "string",
  "language": "${language}",
  "scenes": [
    {
      "sceneNo": 1,
      "text": "string",
      "visualPrompt": "string",
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