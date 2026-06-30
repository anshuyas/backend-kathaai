import { User } from "../models/user.model";
import ReadingSession from "../models/readingSession.model";
import { BADGE_CATALOG } from "../constants/badges";

const now = new Date();

const startOfWeek = new Date(now);
startOfWeek.setDate(now.getDate() - now.getDay());
startOfWeek.setHours(0, 0, 0, 0);

const startOfLastWeek = new Date(startOfWeek);
startOfLastWeek.setDate(startOfWeek.getDate() - 7);

export const getParentDashboardData = async (
  userId: string
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // All reading sessions
  const sessions = await ReadingSession.find({
    userId,
  });

  // This week's sessions
  const thisWeekSessions = await ReadingSession.find({
    userId,
    startedAt: {
      $gte: startOfWeek,
    },
  });

  // Last week's sessions
  const lastWeekSessions = await ReadingSession.find({
    userId,
    startedAt: {
      $gte: startOfLastWeek,
      $lt: startOfWeek,
    },
  });

  // Total time
  const totalMinutes = sessions.reduce(
    (sum, session) => sum + (session.duration || 0),
    0
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Badges
  const unlockedBadges = user.badges
    .map(
      (badge) =>
        BADGE_CATALOG[
          badge as keyof typeof BADGE_CATALOG
        ]
    )
    .filter(Boolean);

  // ---------- THIS WEEK ----------

  const thisWeekMinutes = thisWeekSessions.reduce(
    (sum, s) => sum + (s.duration || 0),
    0
  );

  const lastWeekMinutes = lastWeekSessions.reduce(
    (sum, s) => sum + (s.duration || 0),
    0
  );

  const thisWeekStories = thisWeekSessions.filter(
    (s) => s.completed
  ).length;

  const lastWeekStories = lastWeekSessions.filter(
    (s) => s.completed
  ).length;

  const thisWeekQuiz =
    thisWeekSessions.length > 0
      ? Math.round(
          thisWeekSessions.reduce(
            (sum, s) => sum + (s.quizScore || 0),
            0
          ) / thisWeekSessions.length
        )
      : 0;

  const lastWeekQuiz =
    lastWeekSessions.length > 0
      ? Math.round(
          lastWeekSessions.reduce(
            (sum, s) => sum + (s.quizScore || 0),
            0
          ) / lastWeekSessions.length
        )
      : 0;

  const thisWeekPoints = thisWeekSessions.reduce(
    (sum, s) => sum + (s.pointsEarned || 0),
    0
  );

  const lastWeekPoints = lastWeekSessions.reduce(
    (sum, s) => sum + (s.pointsEarned || 0),
    0
  );

  return {
    stats: {
      storiesRead: user.storiesRead,

      totalPoints: user.totalPoints,

      averageScore:
        user.quizzesCompleted > 0
          ? Math.round(
              user.totalQuizScore /
                user.quizzesCompleted
            )
          : 0,

      timeSpent: `${hours}h ${minutes}m`,
    },

    progress: [
      {
        title: "Stories Read",
        value: `+${user.storiesRead}`,
        width: Math.min(user.storiesRead * 10, 100),
      },

      {
        title: "Time Spent",
        value: `${hours}h ${minutes}m`,
        width: Math.min(totalMinutes / 2, 100),
      },

      {
        title: "Quiz Score",
        value: `${
          user.quizzesCompleted > 0
            ? Math.round(
                user.totalQuizScore /
                  user.quizzesCompleted
              )
            : 0
        }%`,
        width:
          user.quizzesCompleted > 0
            ? Math.round(
                user.totalQuizScore /
                  user.quizzesCompleted
              )
            : 0,
      },

      {
        title: "Points",
        value: `+${user.totalPoints}`,
        width: Math.min(
          user.totalPoints / 10,
          100
        ),
      },
    ],

    comparison: [
      {
        title: "Stories Read",
        thisWeek: `${thisWeekStories}`,
        lastWeek: `${lastWeekStories}`,
        currentWidth: Math.min(
          thisWeekStories * 20,
          100
        ),
        previousWidth: Math.min(
          lastWeekStories * 20,
          100
        ),
      },

      {
        title: "Time Spent",
        thisWeek: `${Math.floor(
          thisWeekMinutes / 60
        )}h ${thisWeekMinutes % 60}m`,
        lastWeek: `${Math.floor(
          lastWeekMinutes / 60
        )}h ${lastWeekMinutes % 60}m`,
        currentWidth: Math.min(
          thisWeekMinutes,
          100
        ),
        previousWidth: Math.min(
          lastWeekMinutes,
          100
        ),
      },

      {
        title: "Quiz Score",
        thisWeek: `${thisWeekQuiz}%`,
        lastWeek: `${lastWeekQuiz}%`,
        currentWidth: thisWeekQuiz,
        previousWidth: lastWeekQuiz,
      },

      {
        title: "Points",
        thisWeek: `${thisWeekPoints}`,
        lastWeek: `${lastWeekPoints}`,
        currentWidth: Math.min(
          thisWeekPoints / 2,
          100
        ),
        previousWidth: Math.min(
          lastWeekPoints / 2,
          100
        ),
      },
    ],

    badges: unlockedBadges,
  };
};