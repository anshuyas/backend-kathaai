import ReadingSession from "../models/readingSession.model";

console.log("READING SESSION MODEL:");
console.log(ReadingSession);
console.log(typeof ReadingSession);

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
  return await ReadingSession.findByIdAndUpdate(
    sessionId,
    {
      completed: true,
      finishedAt: new Date(),
      duration,
    },
    {
      returnDocument: "after",
    }
  );
};