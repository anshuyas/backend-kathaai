import Story from "../models/story.model";

export const saveStory = async (storyData: any) => {
  const story = await Story.create({
    ...storyData,

    // Teacher approval workflow
    status: "pending_approval",
    published: false,

    downloaded: false,
    downloadCount: 0,

    approvedBy: null,
    approvedAt: null,
    rejectionReason: "",
  });

  return story;
};