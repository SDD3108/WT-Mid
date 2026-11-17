
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Game from "./models/Game.js";
import UserData from "./models/UserData.js";
import { gameImageUpload, imageUrl, removeUploadedFiles, uploadsDir } from "./upload.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nextlevel";

app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000","https://nextlevel-blue.vercel.app"] }));
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

const gameId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const gameExists = async (id) => {
  return Boolean(await Game.exists({ id }));
};

const validCollection = (value) => {
  return value == "want" || value == "completed";
};

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Get all games
app.get("/api/games", async (_req, res) => {
  const games = await Game.find().sort({ id: 1 }).select("-_id");
  res.json(games);
});

// Get game by ID
app.get("/api/games/:id", async (req, res) => {
  const id = gameId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid game ID" });
  }

  const game = await Game.findOne({ id }).select("-_id");

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  res.json(game);
});

// Create game
app.post("/api/games", async (req, res) => {
  if (!gameId(req.body.id) || !req.body.title?.trim()) {
    return res.status(400).json({ error: "id and title are required" });
  }

  const game = await Game.create(req.body);
  res.status(201).json(game);
});

// Upload game with images
app.post("/api/games/upload", (req, res, next) => {
  gameImageUpload(req, res, (error) => {
    if (error) {
      removeUploadedFiles(req.files);

      const tooLarge = error.code === "LIMIT_FILE_SIZE";

      return res.status(tooLarge ? 413 : 400).json({
        error: tooLarge
          ? "Each image must be 5 MB or smaller"
          : error.message,
      });
    }

    next();
  });
}, async (req, res) => {
  const text = (key) => String(req.body[key] || "").trim();

  const list = (key) => {
    const value = req.body[key];

    return (Array.isArray(value) ? value : [value || ""])
      .flatMap((item) => String(item).split(","))
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const title = text("title");
  const genres = list("genre");
  const platforms = list("platform");
  const description = text("description");
  const vertical = req.files?.image_vertical?.[0];
  const horizontal = req.files?.image_horizontal?.[0];
  const rating = Number(req.body.rating || 0);
  const releaseDate = text("releaseDate");

  if (
    !title ||
    title.length > 120 ||
    !genres.length ||
    !platforms.length ||
    !description ||
    !vertical ||
    !horizontal ||
    !Number.isFinite(rating) ||
    rating < 0 ||
    rating > 5 ||
    (releaseDate && !/^\d{4}-\d{2}-\d{2}$/.test(releaseDate))
  ) {
    removeUploadedFiles(req.files);

    return res.status(400).json({
      error: "Fill in title, genre, platform, description and both covers correctly",
    });
  }

  const lastGame = await Game.findOne()
    .sort({ id: -1 })
    .select("id");

  const id = (lastGame?.id || 0) + 1;

  const date = releaseDate
    ? new Date(`${releaseDate}T12:00:00Z`)
    : null;

  const game = await Game.create({
    id,
    title,
    genre: genres,
    platform: platforms,
    rating,
    category: ["featured", "trending"].includes(text("category"))
      ? text("category")
      : "trending",
    href: `/games/${id}`,
    description,
    about: text("about") || description,
    features: text("features")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    developer: text("developer"),
    publisher: text("publisher"),
    releaseDate,
    releaseLabel: date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })
      : "",
    modes: text("modes") || "Single player",
    ratingCount: 0,
    image_vertical: imageUrl(req, vertical),
    image_horizontal: imageUrl(req, horizontal),
    screenshots: (req.files?.screenshots || []).map((file) =>
      imageUrl(req, file)
    ),
  });

  res.status(201).json({
    id: game.id,
    title: game.title,
    href: game.href,
  });
});

// Update game
app.put("/api/games/:id", async (req, res) => {
  const id = gameId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid game ID" });
  }

  const { id: _ignored, _id: _mongoId, ...updates } = req.body;

  const game = await Game.findOneAndUpdate(
    { id },
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-_id");

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  res.json(game);
});

// Delete game
app.delete("/api/games/:id", async (req, res) => {
  const id = gameId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid game ID" });
  }

  const game = await Game.findOneAndDelete({ id });

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  await UserData.updateOne(
    { _id: "demo" },
    {
      $pull: {
        favorites: id,
        want: id,
        completed: id,
      },
    }
  );

  res.json({ message: "Game deleted" });
});

// Get favorites
app.get("/api/favorites", async (_req, res) => {
  const data = await UserData.findById("demo");
  res.json(data?.favorites || []);
});

// Add favorite
app.post("/api/favorites/:id", async (req, res) => {
  const id = gameId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid game ID" });
  }

  if (!(await gameExists(id))) {
    return res.status(404).json({ error: "Game not found" });
  }

  const data = await UserData.findByIdAndUpdate(
    "demo",
    {
      $addToSet: { favorites: id },
    },
    { upsert: true, new: true }
  );

  res.json(data.favorites);
});

// Remove favorite
app.delete("/api/favorites/:id", async (req, res) => {
  const id = gameId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid game ID" });
  }

  const data = await UserData.findByIdAndUpdate(
    "demo",
    {
      $pull: { favorites: id },
    },
    { upsert: true, new: true }
  );

  res.json(data.favorites);
});

// Get collections
app.get("/api/collections", async (_req, res) => {
  const data = await UserData.findById("demo");

  res.json({
    want: data?.want || [],
    completed: data?.completed || [],
  });
});

// Add game to collection
app.post("/api/collections/:type/:id", async (req, res) => {
  const { type } = req.params;
  const id = gameId(req.params.id);

  if (!validCollection(type) || !id) {
    return res.status(400).json({
      error: "Invalid collection or game ID",
    });
  }

  if (!(await gameExists(id))) {
    return res.status(404).json({ error: "Game not found" });
  }

  const data = await UserData.findByIdAndUpdate(
    "demo",
    {
      $addToSet: { [type]: id },
    },
    { upsert: true, new: true }
  );

  res.json({
    want: data.want,
    completed: data.completed,
  });
});

// Remove game from collection
app.delete("/api/collections/:type/:id", async (req, res) => {
  const { type } = req.params;
  const id = gameId(req.params.id);

  if (!validCollection(type) || !id) {
    return res.status(400).json({
      error: "Invalid collection or game ID",
    });
  }

  const data = await UserData.findByIdAndUpdate(
    "demo",
    {
      $pull: { [type]: id },
    },
    { upsert: true, new: true }
  );

  res.json({
    want: data.want,
    completed: data.completed,
  });
});

// Clear collection
app.delete("/api/collections/:type", async (req, res) => {
  const { type } = req.params;

  if (!validCollection(type)) {
    return res.status(400).json({ error: "Invalid collection" });
  }

  const data = await UserData.findByIdAndUpdate(
    "demo",
    {
      $set: { [type]: [] },
    },
    { upsert: true, new: true }
  );

  res.json({
    want: data.want,
    completed: data.completed,
  });
});

// Error handler
app.use((error, req, res, _next) => {
  console.error(error);

  if (req.path === "/api/games/upload") {
    removeUploadedFiles(req.files);
  }

  if (error.code === 11000) {
    return res.status(409).json({
      error: req.path === "/api/games/upload"
        ? "Duplicate game ID. Please try again"
        : "Game ID already exists",
    });
  }

  res.status(500).json({ error: "Server error" });
});

// MongoDB connection
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 7000 })
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`API: http://localhost:${PORT}/api/games`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
