import { User } from "../models/user.model";

export const updateReadingStreak = async (
  userId: string
) => {
  const user = await User.findById(userId);

  if (!user) return;

  const today = new Date();

  const last = user.lastReadDate;

  if (!last) {
    user.readingStreak = 1;
  } else {
    const diff =
      Math.floor(
        (today.getTime() - last.getTime()) /
        (1000 * 60 * 60 * 24)
      );

    if (diff === 1) {
      user.readingStreak += 1;
    }

    if (diff > 1) {
      user.readingStreak = 1;
    }
  }

  user.lastReadDate = today;

  await user.save();
};