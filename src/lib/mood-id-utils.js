export function generateMoodId(
  analyzedMood,
  userId,
  timestamp = new Date().toISOString()
) {
  // Generate a random UUID for guaranteed uniqueness
  const uuid = crypto.randomUUID();

  // Normalize the mood text for seeding
  const normalizedMood =
    analyzedMood?.toLowerCase().replace(/[^a-z0-9]/g, "") || "chill";

  // Get last 4 characters of user ID for user context
  const userSuffix = userId?.slice(-4) || "anon";

  // Extract timestamp components for time context
  const timeHash = timestamp.replace(/[^0-9]/g, "").slice(-4);

  // Combine context information with UUID for deterministic seeding
  const contextSeed = `${normalizedMood}${userSuffix}${timeHash}`;

  // Create a hash from context for seeding
  let contextHash = 0;
  for (let i = 0; i < contextSeed.length; i++) {
    const char = contextSeed.charCodeAt(i);
    contextHash = (contextHash << 5) - contextHash + char;
    contextHash = contextHash & contextHash;
  }

  // Use UUID hex (remove dashes) and mix with context
  const uuidHex = uuid.replace(/-/g, "");

  // Take different parts of UUID based on context hash
  const startPos = Math.abs(contextHash) % (uuidHex.length - 7);
  const baseId = uuidHex.substring(startPos, startPos + 7);

  // Convert to base36 for more compact representation (0-9, A-Z)
  const numericValue = parseInt(baseId, 16);
  const encoded = numericValue.toString(36).slice(0, 7).padEnd(7, "0");

  return encoded.toUpperCase();
}

export function isValidMoodId(id) {
  return typeof id === "string" && id.length === 7 && /^[A-Z0-9]{7}$/.test(id);
}

export function findEntryByMoodId(historyArray, moodId) {
  if (!Array.isArray(historyArray) || !isValidMoodId(moodId)) {
    return null;
  }

  return historyArray.find((entry) => entry.moodId === moodId) || null;
}

export function removeEntryByMoodId(historyArray, moodId) {
  if (!Array.isArray(historyArray) || !isValidMoodId(moodId)) {
    return historyArray;
  }

  return historyArray.filter((entry) => entry.moodId !== moodId);
}

export function upsertHistoryEntry(historyArray, newEntry) {
  if (!Array.isArray(historyArray) || !newEntry || !newEntry.moodId) {
    return historyArray;
  }

  const existingIndex = historyArray.findIndex(
    (entry) => entry.moodId === newEntry.moodId
  );

  if (existingIndex !== -1) {
    // Update existing entry
    const updated = [...historyArray];
    updated[existingIndex] = newEntry;
    return updated;
  } else {
    // Add new entry at the beginning
    return [newEntry, ...historyArray];
  }
}
