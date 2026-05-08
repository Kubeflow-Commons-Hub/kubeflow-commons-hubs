"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
}

const PARTICLE_SPACING = 30;
const MOUSE_RADIUS = 130;
const PUSH_FORCE = 0.7;
const RETURN_SPEED = 0.035;
const FRICTION = 0.93;
const BASE_OPACITY = 0.3;
const REVEAL_RADIUS = 160;
const BG_COLOR = "#0A1228";

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animationRef = useRef<number>(0);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const cols = Math.ceil(width / PARTICLE_SPACING) + 1;
    const rows = Math.ceil(height / PARTICLE_SPACING) + 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * PARTICLE_SPACING;
        const y = row * PARTICLE_SPACING;

        const distFromCenter = Math.sqrt(
          Math.pow((x - width / 2) / (width / 2), 2) +
          Math.pow((y - height / 2) / (height / 2), 2)
        );

        const waveFactor = Math.sin(row * 0.12 + col * 0.05) * 0.2 + 0.8;
        const edgeFade = Math.max(0, 1 - distFromCenter * 0.5);
        const opacity = BASE_OPACITY * edgeFade * waveFactor;

        if (opacity > 0.03) {
          particles.push({
            originX: x,
            originY: y,
            x,
            y,
            vx: 0,
            vy: 0,
            opacity,
            size: 1.0 + Math.random() * 0.8,
          });
        }
      }
    }

    particlesRef.current = particles;
    dimensionsRef.current = { width, height };
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = dimensionsRef.current;
    const mouse = mouseRef.current;
    const particles = particlesRef.current;

    ctx.clearRect(0, 0, width, height);

    // Draw the dark overlay that hides the "KUBEFLOW" text behind
    ctx.fillStyle = BG_COLOR;
    ctx.globalAlpha = 0.92;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;

    // Cut a reveal hole where the cursor is
    if (mouse.x > -1000) {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      const revealGradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, REVEAL_RADIUS
      );
      revealGradient.addColorStop(0, "rgba(0,0,0,0.95)");
      revealGradient.addColorStop(0.5, "rgba(0,0,0,0.6)");
      revealGradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = revealGradient;
      ctx.fillRect(mouse.x - REVEAL_RADIUS, mouse.y - REVEAL_RADIUS, REVEAL_RADIUS * 2, REVEAL_RADIUS * 2);
      ctx.restore();
    }

    // Draw particles on top in normal composite mode
    ctx.globalCompositeOperation = "source-over";

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      const dx = mouse.x - p.originX;
      const dy = mouse.y - p.originY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        const angle = Math.atan2(dy, dx);
        p.vx -= Math.cos(angle) * force * PUSH_FORCE;
        p.vy -= Math.sin(angle) * force * PUSH_FORCE;
      }

      p.vx += (p.originX - p.x) * RETURN_SPEED;
      p.vy += (p.originY - p.y) * RETURN_SPEED;
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      p.x += p.vx;
      p.y += p.vy;

      const displacement = Math.sqrt(
        Math.pow(p.x - p.originX, 2) + Math.pow(p.y - p.originY, 2)
      );
      const glowBoost = Math.min(displacement / 15, 1);
      const finalOpacity = p.opacity + glowBoost * 0.5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size + glowBoost * 0.8, 0, Math.PI * 2);

      if (glowBoost > 0.15) {
        ctx.fillStyle = `rgba(56, 189, 248, ${finalOpacity})`;
      } else {
        ctx.fillStyle = `rgba(148, 163, 184, ${finalOpacity})`;
      }
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const section = canvas.closest("section");
    if (!section) return;

    const handleResize = () => {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      initParticles(rect.width, rect.height);
    };

    handleResize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 200);
    };
    window.addEventListener("resize", debouncedResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", debouncedResize);
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [animate, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1]"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
