import Story from "../models/story.model";

export const saveStory = async (storyData: any) => {
  const story = await Story.create({
    ...storyData,

    published: false,
    downloaded: false,
  });

  return story;
};