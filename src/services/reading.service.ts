import ReadingSession from "../models/readingSession.model";

console.log("READING SESSION MODEL:");
console.log(ReadingSession);
console.log(typeof ReadingSession);
import { User } from "../models/user.model";
import { unlockBadges } from "./badge.service";

export const startReading = async (
  userId: string,
  storyId: string
) => {
  return await ReadingSession.create({
    userId,
    storyId,
  });
};

export const finishReading = async (
  sessionId: string,
  duration: number
) => {
  const session = await ReadingSession.findByIdAndUpdate(
    sessionId,
    {
      completed: true,
      finishedAt: new Date(),
      duration,
    },
    {
      new: true,
    }
  );

  if (!session) return null;

  // Has this user already completed this story before?
  const previousReads = await ReadingSession.countDocuments({
    userId: session.userId,
    storyId: session.storyId,
    completed: true,
  });

if (previousReads === 1) {
  await User.findByIdAndUpdate(session.userId, {
    $inc: {
      storiesRead: 1,
    },
  });

  await unlockBadges(session.userId.toString());
}

  return session;
};