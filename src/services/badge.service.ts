import { User } from "../models/user.model";

export const unlockBadges = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) return [];

  const badges = [...user.badges];

  if (user.storiesRead >= 1 && !badges.includes("First Story")) {
    badges.push("First Story");
  }

  if (user.storiesRead >= 5 && !badges.includes("Book Worm")) {
    badges.push("Book Worm");
  }

  if (user.totalPoints >= 100 && !badges.includes("100 Points")) {
    badges.push("100 Points");
  }

  if (user.readingStreak >= 7 && !badges.includes("7 Day Streak")) {
    badges.push("7 Day Streak");
  }

  user.badges = badges;

  await user.save();

  return badges;
};