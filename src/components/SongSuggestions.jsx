import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  Play,
} from "lucide-react";

const SongSuggestions = ({
  suggestions,
  mood,
  moodAnalysis,
  isLoading = false,
  error = null,
  onRetry = null,
}) => {
  const retryButtonRef = useRef(null);

  // Focus management for error states
  useEffect(() => {
    if (error && retryButtonRef.current) {
      retryButtonRef.current.focus();
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
            <Loader2
              className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-white"
              aria-hidden="true"
            />
            <div className="text-center">
              <h3
                className="text-lg sm:text-xl font-medium text-white mb-2"
                role="status"
                aria-live="polite"
              >
                Finding Perfect Songs
              </h3>
              <p className="text-sm sm:text-base text-white/80">
                We're curating songs that match your mood...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    // Determine error type and provide appropriate messaging
    const isNetworkError =
      error.includes("connect") ||
      error.includes("network") ||
      error.includes("internet");
    const isSpotifyError =
      error.includes("Spotify") || error.includes("spotify");
    const isTimeoutError =
      error.includes("timeout") || error.includes("taking too long");

    let errorIcon = <AlertCircle className="w-8 h-8 text-red-400" />;
    let errorTitle = "Oops! Something went wrong";
    let errorDescription = error;
    let showRetry = true;

    if (isNetworkError) {
      errorTitle = "Connection Problem";
      errorDescription =
        "We're having trouble connecting to our servers. Please check your internet connection.";
    } else if (isSpotifyError) {
      errorTitle = "Music Service Unavailable";
      errorDescription =
        "We can't connect to our music service right now. This might be temporary - please try again in a moment.";
    } else if (isTimeoutError) {
      errorTitle = "Request Timeout";
      errorDescription =
        "The request is taking longer than expected. Please try again.";
    }

    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <Card
          className="bg-white/10 backdrop-blur-md border-l-4 border-l-red-400 border-t-white/20 border-r-white/20 border-b-white/20 text-white"
          role="alert"
          aria-live="assertive"
        >
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
            <div aria-hidden="true">{errorIcon}</div>
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-medium text-white mb-2">
                {errorTitle}
              </h3>
              <p className="text-sm sm:text-base text-white/80 mb-4 max-w-md">
                {errorDescription}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {onRetry && showRetry && (
                  <Button
                    ref={retryButtonRef}
                    onClick={onRetry}
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2 text-sm sm:text-base bg-white/20 border-white/30 text-white hover:bg-white/30"
                    aria-describedby="retry-help"
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                    Try Again
                  </Button>
                )}

                <Button
                  onClick={() => window.location.reload()}
                  variant="ghost"
                  size="lg"
                  className="flex items-center gap-2 text-white/80 hover:text-white text-sm sm:text-base hover:bg-white/20"
                  aria-label="Refresh the entire page"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  Refresh Page
                </Button>
              </div>

              {onRetry && showRetry && (
                <p id="retry-help" className="sr-only">
                  This will attempt to generate song suggestions again with the
                  same mood
                </p>
              )}
            </div>

            {/* Additional help for network issues */}
            {isNetworkError && (
              <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                <h4 className="text-sm font-medium text-blue-200 mb-2">
                  Troubleshooting Tips:
                </h4>
                <ul className="text-xs text-blue-300 space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Try refreshing the page</li>
                  <li>• Disable any ad blockers temporarily</li>
                  <li>• Try using a different browser</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!suggestions || !suggestions.tracks || suggestions.tracks.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-8xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Card - Mood Information */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border-white/30 text-white h-fit sticky top-4 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Songs for Your Mood
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mood && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                  <div className="relative p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                    <div className="flex items-center justify-center mb-2">
                      <p className="text-sm text-white/80 font-medium">
                        Your Current Mood
                      </p>
                    </div>
                    <p className="text-lg sm:text-xl text-white font-bold text-center italic tracking-wide">
                      "{mood}"
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                  <div className="flex items-center justify-center mb-1">
                    <svg
                      className="w-4 h-4 text-purple-400 mr-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-sm font-medium text-white">
                      Curated for You
                    </span>
                  </div>
                  <div className="text-xs text-white/60">
                    Personalized recommendations
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-center space-x-2 text-xs text-white/50">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>AI-powered mood analysis</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Card - Song List */}
        <div className="lg:col-span-2">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white h-fit sticky top-4">
            <CardContent>
              <div className="space-y-3 max-h-107 overflow-y-auto">
                {suggestions.tracks.map((track, index) => (
                  <div
                    key={track.id || index}
                    className="flex items-center justify-between p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                      if (track.external_urls?.spotify) {
                        window.open(
                          track.external_urls.spotify,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (track.external_urls?.spotify) {
                          window.open(
                            track.external_urls.spotify,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }
                      }
                    }}
                    aria-label={`Open ${track.name} by ${
                      Array.isArray(track.artists)
                        ? track.artists
                            .map((artist) => artist.name || artist)
                            .join(", ")
                        : track.artists
                    } on Spotify`}
                  >
                    {/* Left side: Album Art + Track Info */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      {/* Album Art */}
                      <div className="flex-shrink-0">
                        {track.album?.images &&
                        track.album.images.length > 0 ? (
                          <img
                            src={
                              track.album.images.find((img) => img.width === 64)
                                ?.url ||
                              track.album.images[track.album.images.length - 1]
                                ?.url ||
                              track.album.images[0]?.url
                            }
                            alt={`${track.album.name} album cover`}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-white/20 flex items-center justify-center">
                            <div className="w-6 h-6 text-white/60">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate text-sm sm:text-base">
                          {track.name}
                        </p>
                        <p className="text-white/70 text-xs sm:text-sm truncate">
                          {Array.isArray(track.artists)
                            ? track.artists
                                .map((artist) => artist.name || artist)
                                .join(", ")
                            : track.artists}
                        </p>
                      </div>
                    </div>

                    {/* Right side: Album Name */}
                    <div className="flex-shrink-0 text-right min-w-0 max-w-xs">
                      {track.album?.name && (
                        <p className="text-white/60 text-xs sm:text-sm truncate">
                          {track.album.name}
                          {track.album?.release_date && (
                            <span className="ml-1 text-white/40">
                              (
                              {new Date(track.album.release_date).getFullYear()}
                              )
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SongSuggestions;
