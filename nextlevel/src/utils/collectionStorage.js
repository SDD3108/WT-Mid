const STORAGE_KEY = "nextlevel-collections";
export const COLLECTIONS_UPDATED_EVENT = "nextlevel-collections-updated";

export function loadCollections() {
  try {
    if (typeof window === "undefined") return { want: [], completed: [] };
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return { want: [], completed: [] };
    const data = JSON.parse(stored);
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return { want: [], completed: [] };
    }
    const validIds = (ids) => Array.isArray(ids)
      ? [...new Set(ids.filter((id) => Number.isSafeInteger(id) && id > 0))]
      : [];
    return { want: validIds(data.want), completed: validIds(data.completed) };
  } catch (error) {
    console.warn("Could not read saved collections:", error);
    return { want: [], completed: [] };
  }
}

/** Accepts either GameCollection objects or plain arrays returned by the API. */
export function saveCollections(collections) {
  try {
    if (typeof window === "undefined") return false;
    const ids = (value) => {
      const source = Array.isArray(value) ? value : value?.gameIds;
      return Array.isArray(source)
        ? [...new Set(source.filter((id) => Number.isSafeInteger(id) && id > 0))]
        : [];
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      want: ids(collections?.want),
      completed: ids(collections?.completed),
    }));
    window.dispatchEvent(new Event(COLLECTIONS_UPDATED_EVENT));
    return true;
  } catch (error) {
    console.warn("Could not save collections:", error);
    return false;
  }
}
