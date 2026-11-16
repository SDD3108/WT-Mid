export const REVIEWS_STORAGE_KEY = "nextlevel-reviews";
export const REVIEWS_UPDATED_EVENT = "nextlevel-reviews-updated";
export const MIN_REVIEW_LENGTH = 10;
export const MAX_REVIEW_LENGTH = 1500;

function isDate(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isStoredReview(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    typeof value.id === "string" && value.id.length > 0 && value.id.length <= 150 &&
    Number.isSafeInteger(value.gameId) && value.gameId > 0 &&
    Number.isInteger(value.rating) && value.rating >= 1 && value.rating <= 5 &&
    typeof value.comment === "string" &&
    value.comment.trim().length >= MIN_REVIEW_LENGTH &&
    value.comment.trim().length <= MAX_REVIEW_LENGTH &&
    isDate(value.createdAt) && isDate(value.updatedAt);
}

export function readReviews() {
  if (typeof window === "undefined") return { reviews: [], error: "" };

  try {
    const raw = window.localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (raw === null) return { reviews: [], error: "" };

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isStoredReview)) {
      return { reviews: [], error: "Saved reviews have an invalid format. Reset the saved reviews to continue." };
    }

    const ids = new Set();
    const gameIds = new Set();
    for (const review of parsed) {
      if (ids.has(review.id) || gameIds.has(review.gameId)) {
        return { reviews: [], error: "Saved reviews contain duplicates. Reset the saved reviews to continue." };
      }
      ids.add(review.id);
      gameIds.add(review.gameId);
    }
    return { reviews: parsed, error: "" };
  } catch (error) {
    console.warn("Could not read saved reviews:", error);
    return {
      reviews: [],
      error: "Reviews could not be read (invalid JSON or browser storage is blocked). Your existing data was not overwritten.",
    };
  }
}

export function saveReviews(reviews) {
  if (typeof window === "undefined") return { ok: false, error: "Browser storage is unavailable." };

  const ids = new Set();
  const gameIds = new Set();
  if (!Array.isArray(reviews) || !reviews.every(isStoredReview) || reviews.some((review) => {
    if (ids.has(review.id) || gameIds.has(review.gameId)) return true;
    ids.add(review.id);
    gameIds.add(review.gameId);
    return false;
  })) {
    return { ok: false, error: "Reviews contain invalid or duplicate data." };
  }

  try {
    window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    window.dispatchEvent(new Event(REVIEWS_UPDATED_EVENT));
    return { ok: true, error: "" };
  } catch (error) {
    console.warn("Could not save reviews:", error);
    return { ok: false, error: "Could not save reviews. Check browser storage permissions or free space." };
  }
}

export function validateReview({ gameId, rating, comment }, validGameIds) {
  const parsedId = Number(gameId);
  if (!Number.isSafeInteger(parsedId) || parsedId <= 0 || !validGameIds.has(parsedId)) {
    return "Select a game from the catalog.";
  }
  if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
    return "Choose a rating from 1 to 5 stars.";
  }
  if (typeof comment !== "string" || comment.trim().length < MIN_REVIEW_LENGTH) {
    return `Write at least ${MIN_REVIEW_LENGTH} characters for your review.`;
  }
  if (comment.trim().length > MAX_REVIEW_LENGTH) {
    return `Your review cannot exceed ${MAX_REVIEW_LENGTH} characters.`;
  }
  return "";
}

export function newReviewId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
