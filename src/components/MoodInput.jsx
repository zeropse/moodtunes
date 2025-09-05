import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const MoodInput = ({ onSubmit, isLoading = false }) => {
  const [moodText, setMoodText] = useState("");
  const [error, setError] = useState("");
  const textareaRef = useRef(null);
  const submitButtonRef = useRef(null);

  const validateInput = (text) => {
    if (!text.trim()) {
      return "Please tell us how you're feeling";
    }
    if (text.trim().length < 3) {
      return "Please describe your mood with at least 3 characters";
    }
    if (text.length > 500) {
      return "Please keep your mood description under 500 characters";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMoodText(value);

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateInput(moodText);
    if (validationError) {
      setError(validationError);
      // Focus textarea for error correction
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      return;
    }

    onSubmit(moodText.trim());
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    // Submit on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Focus management
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const characterCount = moodText.length;
  const isNearLimit = characterCount > 400;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <label
            htmlFor="mood-input"
            className="block text-lg sm:text-xl font-medium text-white"
          >
            How are you feeling today?
          </label>

          <div className="relative">
            <Textarea
              ref={textareaRef}
              id="mood-input"
              name="mood"
              value={moodText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Describe how you're feeling... (anything you write will result in happy songs!)"
              disabled={isLoading}
              className={`
                min-h-[120px] sm:min-h-[140px] text-base sm:text-lg resize-none text-white
                ${
                  error
                    ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                    : ""
                }
              `}
              maxLength={500}
              aria-describedby={error ? "mood-error" : "mood-help"}
              aria-invalid={!!error}
              aria-required="true"
              autoComplete="off"
              spellCheck="true"
            />

            {/* Character count */}
            <div
              className={`
              absolute bottom-2 right-2 text-xs
              ${
                isNearLimit
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-muted-foreground"
              }
            `}
            >
              {characterCount}/500
            </div>
          </div>

          {/* Help text */}
          {!error}

          {/* Error message */}
          {error && (
            <p
              id="mood-error"
              className="text-sm sm:text-base text-destructive"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            ref={submitButtonRef}
            type="submit"
            disabled={isLoading || !moodText.trim()}
            size="lg"
            className="w-full sm:w-auto min-w-[200px] text-base sm:text-lg font-medium bg-white text-black cursor-pointer"
            aria-describedby={isLoading ? "loading-status" : undefined}
          >
            {isLoading ? (
              <>
                <Loader2
                  className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
                  aria-hidden="true"
                />
                Finding perfect songs...
              </>
            ) : (
              "Get Song Suggestions"
            )}
          </Button>

          {moodText.trim() && !isLoading && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setMoodText("");
                setError("");
                if (textareaRef.current) {
                  textareaRef.current.focus();
                }
              }}
              className="w-full sm:w-auto text-base sm:text-lg"
              aria-label="Clear mood input"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Screen reader status updates */}
        {isLoading && (
          <div
            id="loading-status"
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
          >
            Finding songs that match your mood. Please wait.
          </div>
        )}
      </form>
    </div>
  );
};

export default MoodInput;
