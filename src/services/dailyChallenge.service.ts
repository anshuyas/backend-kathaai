import Story from "../models/story.model";

export const getTodayChallenge = async () => {
  const today = new Date().toISOString().slice(0, 10);

  const challenge = await Story.findOne({
    isDailyChallenge: true,
    challengeDate: today,
    published: true,
  });

  return challenge;
};