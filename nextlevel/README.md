# NextLevel 🎮

**NextLevel** is a game discovery and collection management web application built as a **Web Technologies university project**. It lets users browse games, search and filter the catalog, save favorites, manage game collections, write reviews, and view personal gaming statistics. The application also includes a form for adding games with custom artwork.

## Deployment URLs

These addresses are configured in the project; their current availability has not been verified.

- **Frontend:** [nextlevel-blue.vercel.app](https://nextlevel-blue.vercel.app)
- **Backend API:** [wt-mid.onrender.com/api/games](https://wt-mid.onrender.com/api/games)
- **Health check:** [wt-mid.onrender.com/api/health](https://wt-mid.onrender.com/api/health)

> The backend runs on Render's free service, so the first request after inactivity may take longer than usual.

## Features

- **Game catalog:** view available titles with covers, ratings, genres, platforms, descriptions, release dates, and screenshots.
- **Search and filters:** find games by title, genre, platform, rating, and release year; sort the results.
- **Game details:** open a dedicated page for each title and discover related games.
- **Featured and trending:** discover highlighted games on the home page.
- **Favorites:** add or remove games from a shared demo favorites list backed by MongoDB.
- **Collections:** organize games into **Want to Play** and **Completed** lists stored in MongoDB.
- **Reviews:** create and manage personal reviews and ratings, stored in browser `localStorage`.
- **Dashboard:** view collection totals, review counts, average personal rating, and game-genre statistics.
- **Deals:** browse current game offers retrieved from the external CheapShark API.
- **About:** read about the project, submit browser-stored feedback, or switch to the **Add Game** form.
- **Add Game:** add a title, genres, platforms, descriptions, developer/publisher details, and upload cover images and screenshots.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js (App Router), React, JavaScript / JSX |
| Styling | CSS, Bootstrap |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Image uploads | Multer, local server filesystem |
| API requests | Fetch API |
| Hosting | Vercel (frontend), Render (backend) |

## How it works

```text
Browser / Next.js
       |
       | fetch() / HTTP requests
       v
Node.js + Express REST API  ------>  MongoDB Atlas
       |
       +----> /uploads (user-uploaded artwork)

External CheapShark API  --------->  Deals page
Browser localStorage    --------->  Reviews and feedback
```

Most catalog pages retrieve game information from the Express API instead of using a hard-coded frontend array. MongoDB stores game metadata as well as the demo favorites and collections. Uploaded images are stored as files on the backend, and their URLs are saved with each game in MongoDB.

## Project structure

```text
WT-Mid/
├── back-end/
│   ├── models/
│   │   ├── Game.js
│   │   └── UserData.js
│   ├── server.js           # Express API and MongoDB connection
│   ├── upload.js           # Multer upload configuration
│   ├── seed.js             # Initial game data import
│   ├── uploads/            # Uploaded files (created at runtime)
│   └── package.json
├── nextlevel/
│   ├── app/                # Next.js routes (pages)
│   │   ├── about/
│   │   ├── categories/
│   │   ├── collections/
│   │   ├── dashboard/
│   │   ├── deals/
│   │   ├── favorites/
│   │   ├── games/
│   │   └── reviews/
│   ├── public/             # Bundled static images and assets
│   ├── src/
│   │   ├── components/     # AddGameForm and other components
│   │   ├── hooks/          # useGames
│   │   ├── lib/            # API client
│   │   └── utils/          # Dashboard, review and collection helpers
│   └── package.json
└── src/                    # Earlier vanilla JavaScript project files
```

## Getting started

### Requirements

- Node.js 20.9+ (Node.js 22 is suitable)
- npm
- A MongoDB Atlas cluster **or** a running local MongoDB server

### 1. Clone the repository

```bash
git clone https://github.com/SDD3108/WT-Mid.git
cd WT-Mid
```

### 2. Install backend dependencies

```bash
cd back-end
npm install
```

The backend reads its connection string from `MONGO_URI`. No `.env` file is required for this project.

**PowerShell — MongoDB Atlas:**

```powershell
$env:MONGO_URI="mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/nextlevel?retryWrites=true&w=majority"
```

Replace the placeholders with your own Atlas connection details. Keep your database password private and never commit credentials. Atlas must allow incoming connections from your current IP address. If your password contains reserved URL characters, URL-encode them.

**Alternative: local MongoDB**

If `MONGO_URI` is not set, the backend defaults to:

```text
mongodb://127.0.0.1:27017/nextlevel
```

### 3. Import starter games (optional, once)

```bash
npm run seed
```

The script imports the starter catalog only if the games collection is empty. It does **not** overwrite an existing game catalog. In the current script, the MongoDB connection is not explicitly closed; if the process stays open after printing the result, stop it with `Ctrl+C`.

### 4. Start the backend

```bash
npm run dev
```

The API is available at `http://localhost:5000/api/games` by default. You can also run `npm start` without watch mode.

### 5. Start the frontend

Open a second terminal in the repository root:

```bash
cd nextlevel
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**API URL setting:** `nextlevel/src/lib/api.js` currently points to the deployed Render API:

```js
const API_URL = "https://wt-mid.onrender.com/api";
```

To use a local backend instead, change it to:

```js
const API_URL = "http://localhost:5000/api";
```

No frontend environment variable is needed for the current implementation.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | API health status |
| GET | `/api/games` | List games |
| GET | `/api/games/:id` | Get a game by numeric ID |
| POST | `/api/games` | Create a game from JSON (requires `id` and `title`) |
| POST | `/api/games/upload` | Create a game with images (`multipart/form-data`) |
| PUT | `/api/games/:id` | Update a game |
| DELETE | `/api/games/:id` | Delete a game |
| GET | `/api/favorites` | Get favorite game IDs |
| POST | `/api/favorites/:id` | Add a game to favorites |
| DELETE | `/api/favorites/:id` | Remove a favorite |
| GET | `/api/collections` | Get both collections |
| POST | `/api/collections/:type/:id` | Add to `want` or `completed` |
| DELETE | `/api/collections/:type/:id` | Remove from a collection |
| DELETE | `/api/collections/:type` | Clear a collection |

Example:

```js
const response = await fetch("https://wt-mid.onrender.com/api/games");
const games = await response.json();
console.log(games);
```

### Adding a game with images

On the **About** page, select **Add game**, complete the fields, and upload:

- One **vertical cover** (required)
- One **horizontal cover** (required)
- Up to **three screenshots** (optional)

Images must be **JPG, PNG, or WEBP** and no larger than **5 MB each**. The frontend sends a `FormData` request to `POST /api/games/upload`. The backend uses Multer to store image files in `back-end/uploads/`, creates a numeric game ID, and stores the game data and image URLs in MongoDB.

## Deployment

### Backend — Render

Create a **Web Service** connected to this GitHub repository and use:

| Setting | Value |
| --- | --- |
| Root Directory | `back-end` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Environment variable | `MONGO_URI` = your MongoDB Atlas connection string |

Set the Atlas **Network Access** IP allowlist to permit the Render server's outbound connections. Do not paste your database credentials into GitHub. Render provides the `PORT` environment variable automatically.

### Frontend — Vercel

Connect this repository to Vercel and set the **Root Directory** to `nextlevel`. Build using the project's Next.js configuration. Ensure `nextlevel/src/lib/api.js` points to your deployed backend and the backend CORS configuration allows the frontend origin.

### Important deployment limitations

- **Uploaded images are not stored in MongoDB.** They are saved on the backend filesystem. On an ephemeral Render instance, these files may be lost on restarts or redeployments. Use persistent object storage (such as Cloudinary) if reliable image retention is needed. **Cloudinary is not implemented in this repository.**
- **No user authentication:** favorites and collections belong to one shared demo record (`demo`). The game creation, editing, and deletion endpoints are also not protected by authentication. This is suitable only for a controlled academic demonstration, not a production public application.
- **Reviews and feedback:** both are saved in the browser. They are not synced between devices or stored in MongoDB. Dashboard statistics combine browser reviews with collection data fetched from MongoDB (and cached locally).
- **Free hosting:** the Render backend may take longer to respond after being idle.

## University project

Developed for the **Web Technologies** course as a learning project demonstrating:

- React components and hooks
- Next.js routing and dynamic pages
- RESTful HTTP endpoints and `fetch()`
- Express middleware and file uploads
- MongoDB models and CRUD operations with Mongoose
- Browser storage and data visualization
- Connecting a deployed frontend to a deployed backend

## Repository

[github.com/SDD3108/WT-Mid](https://github.com/SDD3108/WT-Mid)
