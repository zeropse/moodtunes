export function getPreviousTrackIds() {
  try {
    if (typeof window === "undefined") return [];

    const existingHistory = localStorage.getItem("moodMusicHistory");
    if (!existingHistory) return [];

    const history = JSON.parse(existingHistory);
    const trackIds = new Set();

    history.forEach((entry) => {
      if (entry.suggestions && entry.suggestions.tracks) {
        entry.suggestions.tracks.forEach((track) => {
          if (track.id) {
            trackIds.add(track.id);
          }
        });
      }
    });

    return Array.from(trackIds);
  } catch (error) {
    console.warn("Error getting previous track IDs:", error);
    return [];
  }
}

export function getSimilarMoodCount(currentMood, currentAnalysis) {
  try {
    if (typeof window === "undefined") return 0;

    const existingHistory = localStorage.getItem("moodMusicHistory");
    if (!existingHistory) return 0;

    const history = JSON.parse(existingHistory);

    // Count entries with similar moods (same analyzed mood or similar text)
    return history.filter((entry) => {
      if (!entry.moodAnalysis) return false;

      // Check if analyzed mood is the same
      if (entry.moodAnalysis.mood === currentAnalysis.mood) return true;

      // Check if the original mood text is very similar (basic similarity check)
      const similarity = calculateTextSimilarity(entry.mood, currentMood);
      return similarity > 0.7; // 70% similarity threshold
    }).length;
  } catch (error) {
    console.warn("Error counting similar moods:", error);
    return 0;
  }
}

function calculateTextSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;

  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);

  const commonWords = words1.filter((word) => words2.includes(word));
  const totalWords = new Set([...words1, ...words2]).size;

  return commonWords.length / totalWords;
}

export function getRetryAttempt(currentMood, currentAnalysis) {
  const similarCount = getSimilarMoodCount(currentMood, currentAnalysis);

  return Math.min(similarCount, 5);
}

export function isRepeatedMood(currentMood, currentAnalysis) {
  return getSimilarMoodCount(currentMood, currentAnalysis) > 0;
}
