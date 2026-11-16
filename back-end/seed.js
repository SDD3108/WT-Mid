import mongoose from "mongoose";
import Game from "./models/Game.js";
import { games } from "../nextlevel/src/data/games.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nextlevel";

await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 7000 });
const count = await Game.countDocuments();
if(count > 0){
  console.log(`Database already has ${count} games. Nothing was overwritten.`);
}
else{
  await Game.insertMany(games);
  console.log(`Added ${games.length} games to MongoDB.`);
}

