import { model } from "../config/gemini.config";
import Groq from "groq-sdk";
import axios from "axios";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

//  Prompt Builder 

const buildPrompt = (
  userPrompt: string,
  language: string,
  ageGroup: string,
  storyLength: string,
  genre: string,
  learningGoal: string,
  heroName: string,
  heroVoice: string,
): string => `
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

QUIZ RULES:
- The quiz array MUST contain exactly 5 questions.
- Never generate fewer than 5 questions.
- Never generate more than 5 questions.
- Each question must have exactly 4 options.
- Questions must test understanding of the story.
- The "answer" field MUST contain the EXACT text of the correct option.
- Never return A, B, C or D as the answer.
- Never return an option index.
- The answer must exactly match one of the option strings.

OTHER RULES:
- Make it child-friendly.
- Include Nepali culture, places, festivals when appropriate.
- Follow the Story Length rules exactly.
- Output MUST be valid JSON only.
- No markdown, no explanations.

IMPORTANT:
For every quiz question, the answer must be copied exactly from one of the four options.

Correct Example:

{
  "question": "Who helped Aarav?",
  "options": [
    { "id": "A", "text": "A wizard" },
    { "id": "B", "text": "A fairy" },
    { "id": "C", "text": "A dragon" },
    { "id": "D", "text": "His mother" }
  ],
  "answer": "B"
}

Wrong Example:

{
  "answer": "C"
}

Never use the wrong example.

Return this exact JSON format:

{
  "title": "string",
  "language": "${language}",
  "scenes": [
    {
      "sceneNo": 1,
      "text": "string",
      "visualPrompt": "string",
      "emotion": "happy | sad | excited | neutral",
      "audioNarration": "string",
    }
  ],
  "quiz": [
  {
    "question": "string",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 2"
  },
  {
    "question": "string",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 3"
  },
  {
    "question": "string",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 1"
  },
  {
    "question": "string",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 4"
  },
  {
    "question": "string",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 2"
  }
]
}

User input:
${userPrompt}
`;

//  Response Parser 

const parseStoryResponse = (raw: string) => {
  const cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  if (!parsed.quiz || parsed.quiz.length !== 5) {
    throw new Error(
      `AI returned ${parsed.quiz?.length ?? 0} quiz questions instead of 5`
    );
  }

  return parsed;
};

//  Provider: Groq 

const generateWithGroq = async (prompt: string) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: "json_object" }, // guarantees valid JSON
  });

  const text = completion.choices[0]?.message?.content ?? "";
  return parseStoryResponse(text);
};

//  Provider: Gemini (fallback) 

const generateWithGemini = async (prompt: string) => {
  let result: any;

  for (let i = 0; i < 3; i++) {
    try {
      result = await model.generateContent(prompt);
      break;
    } catch (error: any) {
      if (i === 2 || error?.status !== 429) throw error;
      // exponential backoff: 2s, 4s, 6s
      await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)));
    }
  }

  if (!result) throw new Error("Gemini failed to generate story");

  const text = result.response.text();
  return parseStoryResponse(text);
};

// ─── Helper ───────────────────────────────────────────────────────────────────

const isQuotaError = (error: any): boolean => {
  const status = error?.status ?? error?.statusCode ?? error?.response?.status;
  const message = error?.message?.toLowerCase() ?? "";
  return (
    status === 429 ||
    status === 503 ||
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("too many requests")
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────

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
  const prompt = buildPrompt(
    userPrompt, language, ageGroup, storyLength,
    genre, learningGoal, heroName, heroVoice
  );

  // ── 1. Try Groq first ──
  try {
    console.log("[AI] Attempting Groq (primary)...");
    const result = await generateWithGroq(prompt);
    console.log("[AI] ✓ Groq succeeded");
    return result;
  } catch (groqError: any) {
    console.warn("[AI] Groq failed:", groqError?.message);

    if (!isQuotaError(groqError)) {
      // Parse error or bad response — no point trying Gemini
      throw new Error("Story generation failed. Please try again.");
    }
  }

  // Fallback to Gemini 
  try {
    console.log("[AI] Groq quota hit, falling back to Gemini...");
    const result = await generateWithGemini(prompt);
    console.log("[AI] ✓ Gemini succeeded");
    return result;
  } catch (geminiError: any) {
    console.error("[AI] Both providers failed:", geminiError?.message);
    throw new Error(
      "Story generation is temporarily unavailable. Please try again in a few minutes."
    );
  }
};

//  Scene Image Generation 

export const generateSceneImage = async (prompt: string) => {
  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    {
      contents: [
        {
          parts: [{ text: `Generate a high quality children story illustration: ${prompt}` }],
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      },
    }
  );

  return response.data;
};

export const generateImage = async (prompt: string) => {
  const response = await axios.post(
    "https://api.stability.ai/v2beta/stable-image/generate/core",
    {
      prompt: `children story illustration, cinematic, 4k: ${prompt}`,
      output_format: "png",
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        Accept: "application/json",
      },
    }
  );

  return response.data;
};