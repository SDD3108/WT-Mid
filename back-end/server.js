import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Game from "./models/Game.js";
import UserData from "./models/UserData.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nextlevel";

app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"] }));
app.use(express.json());

const gameId = (value)=>{
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

const gameExists = async(id)=>{
  return Boolean(await Game.exists({ id }));
}

const validCollection = (value)=>{
  return value == "want" || value == "completed";
}

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Games are fetched from MongoDB, not a hardcoded frontend array.
app.get("/api/games", async (_req, res, next) => {
  const games = await Game.find().sort({ id: 1 }).select("-_id");
  res.json(games);
});

app.get("/api/games/:id", async (req, res, next) => {
  const id = gameId(req.params.id);
  if(!id){
    return res.status(400).json({ error: "Invalid game ID" });
  }
  const game = await Game.findOne({ id }).select("-_id");
  if(!game){
    return res.status(404).json({ error: "Game not found" });
  }
  res.json(game);
});

// Simple CRUD endpoints; handy for demonstrating MongoDB at an exam.
app.post("/api/games", async (req, res, next) => {
  if(!gameId(req.body.id) || !req.body.title?.trim()){
    return res.status(400).json({ error: "id and title are required" });
  }
  const game = await Game.create(req.body);
  res.status(201).json(game);
});

app.put("/api/games/:id", async (req, res, next) => {
  const id = gameId(req.params.id);
  if(!id){
    return res.status(400).json({ error: "Invalid game ID" });
  }
  const { id: _ignored, _id: _mongoId, ...updates } = req.body;
  const game = await Game.findOneAndUpdate({ id }, { $set: updates }, {
    new: true, runValidators: true,
  }).select("-_id");
  if(!game){
    return res.status(404).json({ error: "Game not found" });
  }
  res.json(game);
});

app.delete("/api/games/:id", async (req, res, next) => {
  const id = gameId(req.params.id);
  if(!id){
    return res.status(400).json({ error: "Invalid game ID" });
  }
  const game = await Game.findOneAndDelete({ id });
  if(!game){
    return res.status(404).json({ error: "Game not found" });
  }
  // Also remove the deleted game from favorites and collections.
  await UserData.updateOne({ _id: "demo" }, {
    $pull: { favorites: id, want: id, completed: id },
  });
  res.json({ message: "Game deleted" });
});

// A single shared favorites list: no accounts or authentication.
app.get("/api/favorites", async (_req, res, next) => {
  const data = await UserData.findById("demo");
  res.json(data?.favorites || []);
});

app.post("/api/favorites/:id", async (req, res, next) => {

  const id = gameId(req.params.id);
  if(!id){
    return res.status(400).json({ error: "Invalid game ID" });
  }
  if(!(await gameExists(id))){
    return res.status(404).json({ error: "Game not found" });
  }
  const data = await UserData.findByIdAndUpdate("demo", {
    $addToSet: { favorites: id },
  }, { upsert: true, new: true });
  res.json(data.favorites);
});

app.delete("/api/favorites/:id", async (req, res, next) => {

  const id = gameId(req.params.id);
  if(!id){
    return res.status(400).json({ error: "Invalid game ID" });
  }
  const data = await UserData.findByIdAndUpdate("demo", {
    $pull: { favorites: id },
  }, { upsert: true, new: true });
  res.json(data.favorites);

});

app.get("/api/collections", async (_req, res, next) => {
  const data = await UserData.findById("demo");
  res.json({ want: data?.want || [], completed: data?.completed || [] });
});

app.post("/api/collections/:type/:id", async (req, res, next) => {
  const { type } = req.params;
  const id = gameId(req.params.id);
  if(!validCollection(type) || !id){
    return res.status(400).json({ error: "Invalid collection or game ID" });
  }
  if(!(await gameExists(id))){
    return res.status(404).json({ error: "Game not found" });
  }
  const data = await UserData.findByIdAndUpdate("demo", {
    $addToSet: { [type]: id },
  }, { upsert: true, new: true });
  res.json({ want: data.want, completed: data.completed });

});

app.delete("/api/collections/:type/:id", async (req, res, next) => {

  const { type } = req.params;
  const id = gameId(req.params.id);
  if(!validCollection(type) || !id){
    return res.status(400).json({ error: "Invalid collection or game ID" });
  }
  const data = await UserData.findByIdAndUpdate("demo", {
    $pull: { [type]: id },
  }, { upsert: true, new: true });
  res.json({ want: data.want, completed: data.completed });

});

app.delete("/api/collections/:type", async (req, res, next) => {
  const { type } = req.params;
  if(!validCollection(type)){
    return res.status(400).json({ error: "Invalid collection" });
  }
  const data = await UserData.findByIdAndUpdate("demo", {
    $set: { [type]: [] },
  }, { upsert: true, new: true });
  res.json({ want: data.want, completed: data.completed });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Server error" });
});

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 7000 })
.then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`API: http://localhost:${PORT}/api/games`));
})
.catch((error) => {
  console.error("MongoDB connection failed:", error.message);
  process.exit(1);
});
