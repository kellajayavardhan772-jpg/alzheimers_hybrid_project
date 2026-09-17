import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Activity, Sparkles, Brain, Cpu, Database } from "lucide-react";
import { PROJECT_INFO } from "../config/projectData.js";

export default function HeroSection() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 600], [0, 140]);
  const titleScale = useTransform(scrollY, [0, 600], [1, 0.78]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Neural Particle Matrix Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? "rgba(245, 158, 11, " : "rgba(255, 107, 0, ",
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw particles & synapses
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p1.color}${p1.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 130) * 0.22;
            ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "120px 24px 80px",
        overflow: "hidden",
      }}
    >
      {/* Background Neural Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Ambient Glows */}
      <div className="bg-glow-orb-1" />
      <div className="bg-glow-orb-2" />

      {/* TRANSFORMING HERO CONTENT */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          width: "100%",
          maxWidth: 1250,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          y: titleY,
          scale: titleScale,
          opacity: opacity,
        }}
      >
        {/* TOP STATUS BADGE */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ display: "inline-flex", justifyContent: "center", marginBottom: 24 }}
        >
          <div className="badge-amber">
            <Sparkles size={13} />
            <span>{PROJECT_INFO.subtitle}</span>
          </div>
        </motion.div>

        {/* HUGE OVERSIZED TITLE: ALZHEIMER'S */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            fontFamily: "'Syncopate', sans-serif",
            fontSize: "clamp(48px, 10vw, 140px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 0.92,
            margin: "0 auto 28px",
            width: "100%",
            textAlign: "center",
            color: "#FFFFFF",
            textTransform: "uppercase",
            textShadow: "0 0 70px rgba(245, 158, 11, 0.28)",
          }}
        >
          ALZHEIMER'S
        </motion.h1>

        {/* SUBTITLE & DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontSize: "clamp(18px, 2.4vw, 26px)",
            fontWeight: 400,
            color: "#94A3B8",
            maxWidth: 840,
            margin: "0 auto 40px",
            lineHeight: 1.5,
          }}
        >
          {PROJECT_INFO.tagline}
        </motion.p>

        {/* MRI / BRAIN VISUAL HIGHLIGHT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          style={{
            width: "100%",
            maxWidth: 720,
            padding: "20px 24px",
            marginBottom: 40,
            background: "rgba(14, 16, 23, 0.75)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ padding: 10, borderRadius: 8, background: "rgba(245, 158, 11, 0.15)", color: "#F59E0B" }}>
              <Brain size={22} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#94A3B8" }}>IMAGING TYPE</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#FFF" }}>T1-Weighted MRI Scans</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ padding: 10, borderRadius: 8, background: "rgba(245, 158, 11, 0.15)", color: "#F59E0B" }}>
              <Cpu size={22} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#94A3B8" }}>ARCHITECTURE</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#FFF" }}>Deep CNN + Hybrid QNN</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ padding: 10, borderRadius: 8, background: "rgba(245, 158, 11, 0.15)", color: "#F59E0B" }}>
              <Database size={22} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#94A3B8" }}>ACCURACY TARGET</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#F59E0B" }}>96.4% Multi-Class</div>
            </div>
          </div>
        </motion.div>

        {/* ACTION BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
        >
          <button
            onClick={() => {
              const el = document.getElementById("prototype");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-amber-glow"
            style={{ padding: "16px 36px", fontSize: 16 }}
          >
            <Activity size={20} />
            <span>Explore Interactive Analysis Demo</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById("about");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-outline-amber"
          >
            Read Research Overview
          </button>
        </motion.div>
      </motion.div>

      {/* SCROLL INDICATOR */}
      <motion.div
        onClick={() => {
          const el = document.getElementById("about");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#94A3B8", letterSpacing: "0.15em" }}>
          SCROLL TO EXPLORE
        </span>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#F59E0B",
            background: "rgba(14, 16, 23, 0.6)",
          }}
        >
          <ArrowDown size={16} />
        </div>
      </motion.div>
    </section>
  );
}
