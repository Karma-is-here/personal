"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const layer1Ref = useRef<HTMLVideoElement>(null);
  const layer2Ref = useRef<HTMLVideoElement>(null);

  const [actionVisible, setActionVisible] = useState(false);

  const locked = useRef(false);


  /* =======================================================
     INITIALIZE VIDEOS
     ======================================================= */

  useEffect(() => {
    const idle = layer1Ref.current;
    const action = layer2Ref.current;

    if (!idle || !action) return;

    /*
     * Layer 1 is the permanent background.
     */
    idle.play().catch(() => {});

    /*
     * Load Layer 2 immediately.
     */
    action.load();
  }, []);


  /* =======================================================
     TRIGGER ACTION
     ======================================================= */

  const triggerAction = () => {
    if (locked.current) return;

    const action = layer2Ref.current;

    if (!action) return;

    locked.current = true;

    /*
     * Start Layer 2 immediately.
     */
    action.currentTime = 0;

    action
      .play()
      .then(() => {
        /*
         * IMPORTANT:
         * Do NOT wait for requestVideoFrameCallback.
         *
         * The browser already has the video loaded.
         * Showing the layer immediately gives the
         * fastest possible response.
         */
        setActionVisible(true);
      })
      .catch(() => {
        locked.current = false;
      });
  };


  /* =======================================================
     ACTION FINISHED
     ======================================================= */

  const actionFinished = () => {
    /*
     * Instantly reveal the idle video underneath.
     */
    setActionVisible(false);

    const action = layer2Ref.current;

    if (!action) {
      locked.current = false;
      return;
    }

    /*
     * Wait until Layer 2 has disappeared before
     * resetting its playback position.
     */
    requestAnimationFrame(() => {
      action.pause();
      action.currentTime = 0;

      locked.current = false;
    });
  };


  return (
    <main className="stage">

      {/* =================================================
          LAYER 1 — PERMANENT BACKGROUND
          ================================================= */}

      <video
        ref={layer1Ref}
        className="video video-visible"
        src="/layer-1.mp4"
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
      />


      {/* =================================================
          LAYER 2 — ACTION OVERLAY
          ================================================= */}

      <video
        ref={layer2Ref}
        className={`video action-video ${
          actionVisible
            ? "video-visible"
            : "video-hidden"
        }`}
        src="/layer-2.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={actionFinished}
      />


      {/* =================================================
          TEXT
          ================================================= */}

      <section className="content">
        <div className="text">

          <div className="eyebrow">
            MASTER&apos;S GOT HER HANDS FULL.
          </div>

          <h1>
            WE&apos;LL BE
            <br />
            RIGHT BACK.
          </h1>

          <p>
            SAY HELLO TO IRA WHILE YOU WAIT.
          </p>

        </div>
      </section>


      {/* =================================================
          DOG HOTSPOT
          ================================================= */}

      <div
        className="dog-hotspot"
        onMouseEnter={triggerAction}
      />

    </main>
  );
}