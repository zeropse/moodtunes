export const getHistory = () => {
  if (typeof window === "undefined") return [];
  const history = localStorage.getItem("mood_history");
  return history ? JSON.parse(history) : [];
};

export const saveMoodToHistory = (mood, tracks) => {
  const history = getHistory();
  const newEntry = {
    id: crypto.randomUUID(),
    mood,
    tracks,
    timestamp: new Date().toISOString(),
  };
  const updatedHistory = [newEntry, ...history];
  localStorage.setItem("mood_history", JSON.stringify(updatedHistory));

  // Dispatch event for real-time updates
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("moodHistoryUpdated"));
  }

  return newEntry;
};

export const deleteHistoryItem = (id) => {
  const history = getHistory();
  const updatedHistory = history.filter((item) => item.id !== id);
  localStorage.setItem("mood_history", JSON.stringify(updatedHistory));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("moodHistoryUpdated"));
  }
};

export const clearHistory = () => {
  localStorage.removeItem("mood_history");
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("moodHistoryUpdated"));
  }
};
