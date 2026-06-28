import axios from "axios";

export const generateImage = async (
  prompt: string
) => {
  try {
    console.log("Generating image for:", prompt);

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt +
        ", children's storybook illustration, colorful, high quality, 3D Pixar style, no text"
    )}`;

    return {
      imageUrl,
    };
  } catch (error) {
    console.error("Image generation failed:", error);

    return {
      imageUrl: "",
    };
  }
};