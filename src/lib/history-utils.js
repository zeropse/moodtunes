export const getHistory = (userId) => {
  if (typeof window === "undefined") return [];
  const history = localStorage.getItem("mood_history");
  const allHistory = history ? JSON.parse(history) : [];
  if (!userId) return allHistory;
  return allHistory.filter((item) => item.userId === userId);
};

export const saveMoodToHistory = (mood, tracks, userId) => {
  const allHistoryStr = localStorage.getItem("mood_history");
  const allHistory = allHistoryStr ? JSON.parse(allHistoryStr) : [];

  const newEntry = {
    id: crypto.randomUUID(),
    userId,
    mood,
    tracks,
    timestamp: new Date().toISOString(),
  };

  const updatedHistory = [newEntry, ...allHistory];
  localStorage.setItem("mood_history", JSON.stringify(updatedHistory));

  // Dispatch event for real-time updates
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("moodHistoryUpdated"));
  }

  return newEntry;
};

export const deleteHistoryItem = (id) => {
  const allHistoryStr = localStorage.getItem("mood_history");
  const allHistory = allHistoryStr ? JSON.parse(allHistoryStr) : [];
  const updatedHistory = allHistory.filter((item) => item.id !== id);
  localStorage.setItem("mood_history", JSON.stringify(updatedHistory));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("moodHistoryUpdated"));
  }
};

export const clearHistory = (userId) => {
  if (!userId) {
    localStorage.removeItem("mood_history");
  } else {
    const allHistoryStr = localStorage.getItem("mood_history");
    const allHistory = allHistoryStr ? JSON.parse(allHistoryStr) : [];
    const updatedHistory = allHistory.filter((item) => item.userId !== userId);
    localStorage.setItem("mood_history", JSON.stringify(updatedHistory));
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("moodHistoryUpdated"));
  }
};
