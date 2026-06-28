import ReadingSession from "../models/readingSession.model";
import { User } from "../models/user.model";
import { unlockBadges } from "./badge.service";
import { updateReadingStreak } from "./streak.service";

export const saveQuizResult = async (
  sessionId: string,
  score: number,
  pointsEarned: number
) => {
  const session =
    await ReadingSession.findByIdAndUpdate(
      sessionId,
      {
        quizScore: score,
        pointsEarned,
      },
      {
        returnDocument: "after",
      }
    );

  if (!session) {
    throw new Error("Reading session not found");
  }

  await User.findByIdAndUpdate(
    session.userId,
    {
      $inc: {
        totalPoints: pointsEarned,
        storiesRead: 1,
        quizzesCompleted: 1,
        totalQuizScore: score,
      },
    }
  );

  await updateReadingStreak(
    session.userId.toString()
  );

  const badges = await unlockBadges(
    session.userId.toString()
  );

  const user = await User.findById(session.userId);

  return {
    session,
    user,
    badges,
  };
};