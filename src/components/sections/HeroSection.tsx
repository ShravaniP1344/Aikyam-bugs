import { useEffect, useRef, useState } from 'react';
import { MagneticButton } from '../ui/MagneticButton';

export const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    const handleVideoReady = () => {
      setIsVideoReady(true);
      video.play().catch((err) => {
        console.warn('Hero orb video autoplay prevented:', err);
      });
    };

    if (video.readyState >= 3) {
      handleVideoReady();
    } else {
      video.addEventListener('canplay', handleVideoReady, { once: true });
      video.addEventListener('playing', () => setIsVideoReady(true), { once: true });
    }

    return () => {
      video.removeEventListener('canplay', handleVideoReady);
    };
  }, []);

  return (
    <section className="hero" id="home" data-label="Home">
      <div className="hero-atmosphere" aria-hidden="true" />

      <div className="container hero-layout relative z-10">
        <div className="hero-content">
          <div className="eyebrow reveal">AI • Automation • Transformation</div>
          <h1 className="reveal delay-1">
            <span className="grad">One Intelligence.</span>
            <br />
            Infinite Possibilities.
          </h1>
          <p className="hero-copy reveal delay-2">
            AIKYAM builds intelligent AI-driven systems that unite people, data, technology, and business goals into secure, scalable, measurable impact.
          </p>
          <div className="hero-actions reveal delay-3">
            <MagneticButton href="#services" variant="primary">
              Explore Solutions <span className="arrow">→</span>
            </MagneticButton>
            <MagneticButton href="#about" variant="ghost">
              Discover AIKYAM <span className="arrow">↘</span>
            </MagneticButton>
          </div>
        </div>

        <div className="hero-visual reveal delay-2" aria-hidden="true">
          <div className="particles">
            <span className="particle p1" />
            <span className="particle p2" />
            <span className="particle p3" />
            <span className="particle p4" />
            <span className="particle p5" />
            <span className="particle p6" />
            <span className="particle p7" />
            <span className="particle p8" />
          </div>

          <div className="orb-scene">
            <div className="light-streak ls1" />
            <div className="light-streak ls2" />
            <div className="orbit-ring ring--1">
              <span className="ring-dot" />
            </div>
            <div className="orbit-ring ring--2">
              <span className="ring-dot" />
            </div>
            <div className="streak streak--1" />
            <div className="streak streak--2" />
            <div className="spark" />

            <div className="orb">
              <div className="hero-orb-media">
                <img
                  src="/assets/media/globe-poster.webp"
                  alt="AIKYAM Intelligence Globe"
                  className="hero-orb-poster"
                  loading="eager"
                  decoding="async"
                  width="720"
                  height="720"
                />
                <video
                  ref={videoRef}
                  className={`hero-orb-video ${isVideoReady ? 'is-ready' : ''}`}
                  poster="/assets/media/globe-poster.webp"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  disableRemotePlayback
                  onLoadedData={() => setIsVideoReady(true)}
                  onCanPlay={() => setIsVideoReady(true)}
                  onPlaying={() => setIsVideoReady(true)}
                >
                  <source
                    src="/assets/media/globe-optimized.webm"
                    type="video/webm"
                  />
                  <source
                    src="/assets/media/globe-optimized.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="orb-reflection" />
            </div>

            <div className="orb-pedestal" />
          </div>
        </div>
      </div>

      <div className="scroll-cue">
        <span>Scroll to explore</span>
        <span className="mouse" aria-hidden="true" />
      </div>
    </section>
  );
};

