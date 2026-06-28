import Story from "../models/story.model";

export const getTeacherDashboard = async () => {
  const pending = await Story.find({
    published: false,
    rejectionReason: "",
  }).sort({ createdAt: -1 });

  const approved = await Story.find({
    published: true,
  }).sort({ createdAt: -1 });

  const rejected = await Story.find({
    rejectionReason: { $ne: "" },
  }).sort({ createdAt: -1 });

  return {
    progress: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      storiesRead: [6, 9, 11, 8, 14],
      quizzesTaken: [4, 8, 10, 7, 12],
    },

    leaderboard: [
      {
        name: "Ananya Sharma",
        points: 1250,
      },
      {
        name: "Rohan Khatri",
        points: 1120,
      },
      {
        name: "Priya Basnet",
        points: 1080,
      },
      {
        name: "Sameer Dahal",
        points: 995,
      },
      {
        name: "Maya Adhikari",
        points: 940,
      },
    ],

    approvals: {
      pending,
      approved,
      rejected,
    },
  };
};