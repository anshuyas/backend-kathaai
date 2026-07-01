import mongoose from "mongoose";
import dotenv from "dotenv";
import Story from "../src/models/story.model";

dotenv.config();

const run = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI not found in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  // Only touch stories with a missing/empty coverImage that actually have
  // a scene image to backfill from — never overwrites an existing coverImage.
  const candidates = await Story.find({
    $or: [{ coverImage: "" }, { coverImage: { $exists: false } }],
    "scenes.0.imageUrl": { $exists: true, $ne: "" },
  });

  console.log(`Found ${candidates.length} stories missing coverImage`);

  let updated = 0;

  for (const story of candidates) {
    const firstSceneImage = story.scenes?.[0]?.imageUrl;

    if (firstSceneImage) {
      story.coverImage = firstSceneImage;
      await story.save();
      updated++;
      console.log(`✓ Backfilled "${story.title}" (${story._id})`);
    }
  }

  console.log(`Done. Updated ${updated}/${candidates.length} stories.`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});