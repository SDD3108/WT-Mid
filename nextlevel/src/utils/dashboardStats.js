export function calculateDashboardStats(collections, reviews, games) {
    const validIds = (items) => Array.isArray(items)
      ? [...new Set(items.filter((id) => Number.isSafeInteger(id) && id > 0))]
      : [];
  
    const want = validIds(collections?.want);
    const completed = validIds(collections?.completed);
    const validReviews = Array.isArray(reviews) ? reviews.filter((review) => Number.isInteger(review?.rating) && review.rating >= 1 && review.rating <= 5) : [];
    const averageRating = validReviews.length ? validReviews.reduce((total, review) => total + review.rating, 0) / validReviews.length : null;
  
    const uniqueGameIds = new Set([...want, ...completed]);
    const genres = new Map();
    const catalog = Array.isArray(games) ? games : [];
    for (const game of catalog) {
      if (!uniqueGameIds.has(game?.id)) continue;
      for (const genre of new Set(Array.isArray(game.genre) ? game.genre : [])) {
        if (typeof genre !== "string" || !genre.trim()) continue;
        const label = genre.trim();
        genres.set(label, (genres.get(label) || 0) + 1);
      }
    }
  
    return {
      wantCount: want.length,
      completedCount: completed.length,
      reviewCount: validReviews.length,
      averageRating,
      totalInLists: want.length + completed.length,
      uniqueGames: uniqueGameIds.size,
      genreData: [...genres.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    };
  }
  