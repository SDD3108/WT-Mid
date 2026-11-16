import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    genre: [String],
    platform: [String],
    rating: Number,
    category: String,
    href: String,
    description: String,
    about: String,
    features: [String],
    developer: String,
    publisher: String,
    releaseDate: String,
    releaseLabel: String,
    modes: String,
    ratingCount: Number,
    image_vertical: String,
    image_horizontal: String,
    screenshots: [String],
  },
  { versionKey: false }
);

export default mongoose.model("Game", gameSchema);
