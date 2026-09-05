"use client";

import { useEffect, useRef, useState } from "react";

type TypingCue = {
  start: number;
  end: number;
  text: string;
};

/*
 * Adjust ONLY these timings.
 */
const TYPING_CUES: TypingCue[] = [
  { start: 0.0, end: 1.0, text: "we'll" },
  { start: 1.0, end: 2.0, text: "we'll be" },
  { start: 2.0, end: 3.2, text: "we'll be right" },
  { start: 3.2, end: 4.6, text: "we'll be right back" },
  { start: 4.6, end: 6.0, text: "we'll be right back." },
];

export default function DogTyping() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [query, setQuery] = useState("");
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const updateTyping = () => {
      const time = video.currentTime;

      const cue = TYPING_CUES.find(
        (item) => time >= item.start && time < item.end
      );

      if (cue) {
        setQuery(cue.text);
      } else if (
        TYPING_CUES.length > 0 &&
        time >= TYPING_CUES[TYPING_CUES.length - 1].end
      ) {
        setQuery(TYPING_CUES[TYPING_CUES.length - 1].text);
      }
    };

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    video.addEventListener("timeupdate", updateTyping);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", updateTyping);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  return (
    <main className="dog-page">

      {/* Blurred ambient layer */}
      <video
        className="dog-page__background"
        src="/dog-typing.mp4"
        muted
        autoPlay
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Main zoomed video */}
      <video
        ref={videoRef}
        className="dog-page__video"
        src="/dog-typing.mp4"
        poster="/dog-typing-poster.png"
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        aria-label="Dog typing on a laptop"
      />

      {/* Global glass / morph treatment */}
      <div
        className="dog-page__glass"
        aria-hidden="true"
      />

      {/* Very subtle edge vignette */}
      <div
        className="dog-page__vignette"
        aria-hidden="true"
      />

      {/* Search bubble */}
      <div
        className="dog-search"
        role="status"
        aria-live="polite"
      >
        <div className="dog-search__icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="10.8"
              cy="10.8"
              r="6.5"
              stroke="currentColor"
              strokeWidth="1.7"
            />

            <path
              d="M16 16l4.2 4.2"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="dog-search__text">
          {query}
          <span className="dog-search__cursor" />
        </div>

        <button
          type="button"
          className="dog-search__button"
          onClick={togglePlayback}
          aria-label={playing ? "Pause video" : "Play video"}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" fill="none">
              <rect
                x="8"
                y="6"
                width="3"
                height="12"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="13"
                y="6"
                width="3"
                height="12"
                rx="1"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6l9 6-9 6V6z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>
      </div>

    </main>
  );
}