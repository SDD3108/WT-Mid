import mongoose from "mongoose";

// One shared demo account, to keep this university project simple.
const userDataSchema = new mongoose.Schema(
  {
    _id: { type: String, default: "demo" },
    favorites: { type: [Number], default: [] },
    want: { type: [Number], default: [] },
    completed: { type: [Number], default: [] },
  },
  { versionKey: false }
);

export default mongoose.model("UserData", userDataSchema);
