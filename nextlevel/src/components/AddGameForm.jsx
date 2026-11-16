"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/src/lib/api";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const emptyImages = { vertical: null, horizontal: null, screenshots: [] };

export default function AddGameForm() {
  const [images, setImages] = useState(emptyImages);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);

  const previews = useMemo(() => ({
    vertical: images.vertical ? URL.createObjectURL(images.vertical) : "",
    horizontal: images.horizontal ? URL.createObjectURL(images.horizontal) : "",
    screenshots: images.screenshots.map((file) => URL.createObjectURL(file)),
  }), [images]);

  useEffect(() => () => {
    [previews.vertical, previews.horizontal, ...previews.screenshots]
      .filter(Boolean)
      .forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  function changeImage(type, event) {
    const files = Array.from(event.target.files || []);
    setImages((previous) => ({
      ...previous,
      [type]: type === "screenshots" ? files : (files[0] || null),
    }));
    setError("");
    setCreated(null);
  }

  async function submitGame(event) {
    event.preventDefault();
    if (saving) return;
    setError("");
    setCreated(null);

    const allImages = [images.vertical, images.horizontal, ...images.screenshots].filter(Boolean);
    if (!images.vertical || !images.horizontal) {
      setError("Please upload a vertical and a horizontal cover.");
      return;
    }
    if (images.screenshots.length > 3) {
      setError("Select no more than 3 screenshots.");
      return;
    }
    if (allImages.some((file) => !ALLOWED_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE)) {
      setError("Images must be JPG, PNG or WEBP, up to 5 MB each.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    if (!formData.getAll("platform").length) {
      setError("Choose at least one platform.");
      return;
    }

    setSaving(true);
    try {
      const game = await apiFetch("/games/upload", {
        method: "POST",
        body: formData,
      });
      setCreated(game);
      form.reset();
      setImages(emptyImages);
    } catch (err) {
      setError(err.message || "Could not add the game.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form id="add-game-form" className="add-game-form" onSubmit={submitGame}>
      <div className="add-game-grid">
        <div className="add-game-field">
          <label htmlFor="new-game-title">Game title <span>*</span></label>
          <input id="new-game-title" name="title" type="text" className="form-control" maxLength={120} placeholder="e.g. My New Adventure" required />
        </div>
        <div className="add-game-field">
          <label htmlFor="new-game-genres">Genres <span>*</span></label>
          <input id="new-game-genres" name="genre" type="text" className="form-control" placeholder="Action, RPG, Adventure" required />
          <small>Separate multiple genres with commas.</small>
        </div>
        <div className="add-game-field add-game-wide">
          <span className="add-game-field-title">Platforms <span>*</span></span>
          <div className="add-game-checkboxes">
            {(["PC", "Console", "Mobile"]).map((platform) => (
              <label key={platform}><input name="platform" type="checkbox" value={platform} /> {platform}</label>
            ))}
          </div>
        </div>
        <div className="add-game-field">
          <label htmlFor="new-game-rating">Rating (0–5)</label>
          <input id="new-game-rating" name="rating" type="number" min="0" max="5" step="0.1" defaultValue="4.0" className="form-control" />
        </div>
        <div className="add-game-field">
          <label htmlFor="new-game-category">Home page section</label>
          <select id="new-game-category" name="category" className="form-select" defaultValue="trending">
            <option value="trending">Trending</option>
            <option value="featured">Featured</option>
          </select>
        </div>
        <div className="add-game-field add-game-wide">
          <label htmlFor="new-game-description">Short description <span>*</span></label>
          <textarea id="new-game-description" name="description" className="form-control" rows={3} placeholder="A short overview of your game..." required />
        </div>
        <div className="add-game-field add-game-wide">
          <label htmlFor="new-game-about">About this game</label>
          <textarea id="new-game-about" name="about" className="form-control" rows={4} placeholder="Gameplay, world, story and more..." />
        </div>
        <div className="add-game-field add-game-wide">
          <label htmlFor="new-game-features">Features</label>
          <textarea id="new-game-features" name="features" className="form-control" rows={3} placeholder={"Open world exploration\nMultiplayer mode\nCustomizable characters"} />
          <small>One feature per line.</small>
        </div>
        <div className="add-game-field">
          <label htmlFor="new-game-developer">Developer</label>
          <input id="new-game-developer" name="developer" className="form-control" placeholder="Studio name" />
        </div>
        <div className="add-game-field">
          <label htmlFor="new-game-publisher">Publisher</label>
          <input id="new-game-publisher" name="publisher" className="form-control" placeholder="Publisher name" />
        </div>
        <div className="add-game-field">
          <label htmlFor="new-game-release">Release date</label>
          <input id="new-game-release" name="releaseDate" type="date" className="form-control" />
        </div>
        <div className="add-game-field">
          <label htmlFor="new-game-modes">Game mode</label>
          <select id="new-game-modes" name="modes" className="form-select" defaultValue="Single player">
            <option>Single player</option>
            <option>Multiplayer</option>
            <option>Single player / Multiplayer</option>
          </select>
        </div>
      </div>

      <div className="add-game-images">
        <h3>Game images</h3>
        <p>JPG, PNG or WEBP · Up to 5 MB per image. Images are saved on the local backend.</p>
        <div className="add-game-upload-grid">
          <div className="add-game-field">
            <label htmlFor="new-game-vertical">Vertical cover <span>*</span></label>
            <input id="new-game-vertical" name="image_vertical" type="file" accept="image/png,image/jpeg,image/webp" className="form-control" onChange={(e) => changeImage("vertical", e)} required />
            {previews.vertical && <img className="add-game-preview add-game-preview-vertical" src={previews.vertical} alt="Vertical cover preview" />}
          </div>
          <div className="add-game-field">
            <label htmlFor="new-game-horizontal">Horizontal cover <span>*</span></label>
            <input id="new-game-horizontal" name="image_horizontal" type="file" accept="image/png,image/jpeg,image/webp" className="form-control" onChange={(e) => changeImage("horizontal", e)} required />
            {previews.horizontal && <img className="add-game-preview add-game-preview-horizontal" src={previews.horizontal} alt="Horizontal cover preview" />}
          </div>
          <div className="add-game-field add-game-wide">
            <label htmlFor="new-game-screenshots">Screenshots (up to 3)</label>
            <input id="new-game-screenshots" name="screenshots" type="file" accept="image/png,image/jpeg,image/webp" multiple className="form-control" onChange={(e) => changeImage("screenshots", e)} />
            {previews.screenshots.length > 0 && <div className="add-game-screenshots">
              {previews.screenshots.map((url, index) => <img key={url} src={url} className="add-game-preview" alt={`Screenshot preview ${index + 1}`} />)}
            </div>}
          </div>
        </div>
      </div>

      <button className="feedback-submit" type="submit" disabled={saving}>
        {saving ? "SAVING GAME..." : "ADD GAME TO DATABASE"}
      </button>
      {error && <p className="add-game-error" role="alert">{error}</p>}
      {created && <p className="add-game-success" role="status">
        <strong>{created.title}</strong> was added to MongoDB. <Link href={`/games/${created.id}`}>View the game →</Link>
      </p>}
    </form>
  );
}
