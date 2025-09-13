// Spotify API caching and rate limiting system
class SpotifyCache {
  constructor() {
    this.cache = new Map();
    this.requestQueue = [];
    this.isProcessing = false;
    this.rateLimitDelay = 100; // ms between requests
    this.maxCacheSize = 1000;
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes

    // Clean up expired cache entries periodically
    setInterval(() => this.cleanupCache(), 5 * 60 * 1000); // Every 5 minutes
  }

  // Generate cache key for search queries
  generateCacheKey(query, options = {}) {
    const { limit = 20, offset = 0 } = options;
    return `search:${query}:${limit}:${offset}`;
  }

  // Get cached result if available and not expired
  getCached(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    console.log(`Cache hit for key: ${key}`);
    return cached.data;
  }

  // Store result in cache
  setCached(key, data) {
    const now = Date.now();

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      expiry: now + this.cacheExpiry,
      created: now,
    });

    console.log(`Cached result for key: ${key}`);
  }

  // Clean up expired cache entries
  cleanupCache() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiry) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`Cleaned up ${cleaned} expired cache entries`);
    }
  }

  // Add request to queue for rate limiting
  async queueRequest(requestFn) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ requestFn, resolve, reject });
      this.processQueue();
    });
  }

  // Process queued requests with rate limiting
  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const { requestFn, resolve, reject } = this.requestQueue.shift();

      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }

      // Rate limiting delay
      if (this.requestQueue.length > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.rateLimitDelay)
        );
      }
    }

    this.isProcessing = false;
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiry) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      queueLength: this.requestQueue.length,
      isProcessing: this.isProcessing,
      maxCacheSize: this.maxCacheSize,
      cacheExpiryMs: this.cacheExpiry,
    };
  }

  // Clear all cache
  clearCache() {
    this.cache.clear();
    console.log("Cache cleared");
  }
}

// Create singleton instance
const spotifyCache = new SpotifyCache();

export default spotifyCache;
