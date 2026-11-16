"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/src/lib/api";

export const useGames =()=>{
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiFetch("/games")
      .then((data) => { if (active) setGames(data); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return { games, loading, error };
}
