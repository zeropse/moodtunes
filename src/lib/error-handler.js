// Comprehensive error handling and retry system
export class ErrorHandler {
  constructor(config = {}) {
    this.maxRetries = config.maxRetries || 3;
    this.baseDelay = config.baseDelay || 1000;
    this.maxDelay = config.maxDelay || 10000;
    this.backoffFactor = config.backoffFactor || 2;
    this.jitter = config.jitter || true;

    this.errorCounts = new Map();
    this.circuitBreakers = new Map();
  }

  // Exponential backoff with jitter
  calculateDelay(attempt) {
    let delay = this.baseDelay * Math.pow(this.backoffFactor, attempt);
    delay = Math.min(delay, this.maxDelay);

    if (this.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    return delay;
  }

  // Retry function with exponential backoff
  async retry(fn, context = "operation") {
    let lastError;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await fn();

        // Reset error count on success
        this.errorCounts.delete(context);
        this.resetCircuitBreaker(context);

        return result;
      } catch (error) {
        lastError = error;

        // Track error count
        const errorCount = (this.errorCounts.get(context) || 0) + 1;
        this.errorCounts.set(context, errorCount);

        // Check circuit breaker
        if (this.isCircuitBreakerOpen(context)) {
          throw new Error(`Circuit breaker open for ${context}`);
        }

        // Don't retry on final attempt
        if (attempt === this.maxRetries) {
          break;
        }

        // Don't retry certain error types
        if (this.isNonRetryableError(error)) {
          break;
        }

        // Wait before retry
        const delay = this.calculateDelay(attempt);
        console.warn(
          `Retry attempt ${attempt + 1}/${
            this.maxRetries
          } for ${context} after ${delay}ms:`,
          error.message
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // Open circuit breaker after max retries
    this.openCircuitBreaker(context);
    throw lastError;
  }

  // Check if error should not be retried
  isNonRetryableError(error) {
    const nonRetryableStatuses = [400, 401, 403, 404, 422];
    const nonRetryableMessages = [
      "invalid_request",
      "unauthorized",
      "forbidden",
    ];

    // HTTP status codes
    if (error.statusCode && nonRetryableStatuses.includes(error.statusCode)) {
      return true;
    }

    // Error messages
    if (error.message) {
      const message = error.message.toLowerCase();
      return nonRetryableMessages.some((msg) => message.includes(msg));
    }

    return false;
  }

  // Circuit breaker implementation
  isCircuitBreakerOpen(context) {
    const breaker = this.circuitBreakers.get(context);
    if (!breaker) return false;

    const now = Date.now();

    // Check if circuit breaker should be reset
    if (now > breaker.resetTime) {
      this.resetCircuitBreaker(context);
      return false;
    }

    return breaker.isOpen;
  }

  openCircuitBreaker(context) {
    const resetTime = Date.now() + 5 * 60 * 1000; // 5 minutes
    this.circuitBreakers.set(context, {
      isOpen: true,
      resetTime,
      openedAt: Date.now(),
    });

    console.warn(
      `Circuit breaker opened for ${context}, reset at ${new Date(resetTime)}`
    );
  }

  resetCircuitBreaker(context) {
    this.circuitBreakers.delete(context);
    console.log(`Circuit breaker reset for ${context}`);
  }

  // Get error statistics
  getErrorStats() {
    const stats = {
      errorCounts: Object.fromEntries(this.errorCounts),
      circuitBreakers: {},
    };

    for (const [context, breaker] of this.circuitBreakers) {
      stats.circuitBreakers[context] = {
        isOpen: breaker.isOpen,
        resetTime: new Date(breaker.resetTime).toISOString(),
        openedAt: new Date(breaker.openedAt).toISOString(),
      };
    }

    return stats;
  }
}

// Global error handler instance
export const globalErrorHandler = new ErrorHandler();

// Specific error types
export class APIError extends Error {
  constructor(message, statusCode = 500, retryable = true) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.retryable = retryable;
  }
}

export class NetworkError extends Error {
  constructor(message, retryable = true) {
    super(message);
    this.name = "NetworkError";
    this.retryable = retryable;
  }
}

export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.retryable = false;
  }
}

// Error logging utility
export class ErrorLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
  }

  log(error, context = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        statusCode: error.statusCode,
      },
      context,
      id: this.generateId(),
    };

    this.logs.unshift(logEntry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console logging based on error severity
    if (error.statusCode >= 500 || error.name === "NetworkError") {
      console.error("Error logged:", logEntry);
    } else {
      console.warn("Warning logged:", logEntry);
    }

    return logEntry.id;
  }

  getLogs(limit = 50) {
    return this.logs.slice(0, limit);
  }

  getLogById(id) {
    return this.logs.find((log) => log.id === id);
  }

  clearLogs() {
    this.logs = [];
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get error statistics
  getStats() {
    const errorTypes = {};
    const statusCodes = {};
    let totalErrors = 0;

    this.logs.forEach((log) => {
      totalErrors++;

      const errorType = log.error.name;
      errorTypes[errorType] = (errorTypes[errorType] || 0) + 1;

      if (log.error.statusCode) {
        const statusCode = log.error.statusCode;
        statusCodes[statusCode] = (statusCodes[statusCode] || 0) + 1;
      }
    });

    return {
      totalErrors,
      errorTypes,
      statusCodes,
      recentErrors: this.logs.slice(0, 10).map((log) => ({
        timestamp: log.timestamp,
        error: log.error.name,
        message: log.error.message,
      })),
    };
  }
}

// Global error logger instance
export const globalErrorLogger = new ErrorLogger();

// Enhanced fetch wrapper with error handling
export async function safeFetch(url, options = {}) {
  const context = `fetch_${new URL(url).pathname}`;

  return globalErrorHandler.retry(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      options.timeout || 10000
    );

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        const error = new APIError(errorMessage, response.status);
        globalErrorLogger.log(error, { url, options });
        throw error;
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        const timeoutError = new NetworkError("Request timeout");
        globalErrorLogger.log(timeoutError, { url, options });
        throw timeoutError;
      }

      if (error instanceof APIError) {
        throw error;
      }

      const networkError = new NetworkError(`Network error: ${error.message}`);
      globalErrorLogger.log(networkError, { url, options });
      throw networkError;
    }
  }, context);
}

// User-friendly error messages
export function getUserFriendlyErrorMessage(error) {
  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof APIError) {
    switch (error.statusCode) {
      case 400:
        return "Invalid request. Please check your input and try again.";
      case 401:
        return "Authentication required. Please sign in to continue.";
      case 403:
        return "Access denied. You don't have permission for this action.";
      case 404:
        return "The requested resource was not found.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 500:
        return "Server error. Please try again later.";
      case 503:
        return "Service temporarily unavailable. Please try again later.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  }

  if (error instanceof NetworkError) {
    return "Network connection error. Please check your internet connection and try again.";
  }

  return "An unexpected error occurred. Please try again.";
}
