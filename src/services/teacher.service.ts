import Story from "../models/story.model";
import { User } from "../models/user.model";

export const getTeacherDashboard = async () => {
    
 const pending = await Story.find({
  status: "pending_approval",
})
  .populate("userId", "fullName email")
  .sort({ createdAt: -1 });

  console.log(JSON.stringify(pending, null, 2));

const approved = await Story.find({
  status: "approved",
})
  .populate("userId", "fullName email")
  .sort({ createdAt: -1 });

const rejected = await Story.find({
  status: "rejected",
})
  .populate("userId", "fullName email")
  .sort({ createdAt: -1 });

  const leaderboard = await User.find({ role: "student" })
  .sort({ totalPoints: -1 })
  .limit(5)
  .select("fullName totalPoints");

  const progressAgg = await User.aggregate([
  { $match: { role: "student" } },
  {
    $group: {
      _id: null,
      totalStoriesRead: { $sum: "$storiesRead" },
      totalQuizzesCompleted: { $sum: "$quizzesCompleted" },
    },
  },
]);
 console.log("progressAgg:", progressAgg);

const progress = {
  totalStoriesRead: progressAgg[0]?.totalStoriesRead ?? 0,
  totalQuizzesCompleted: progressAgg[0]?.totalQuizzesCompleted ?? 0,
};

  return {
    progress,

    leaderboard: leaderboard.map((u) => ({
  name: u.fullName,
  points: u.totalPoints,
})),

    approvals: {
      pending,
      approved,
      rejected,
    },
  };
};