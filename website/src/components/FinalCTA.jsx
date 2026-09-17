import React from "react";
import { motion } from "framer-motion";
import { Activity, ExternalLink, ArrowUpRight } from "lucide-react";
import { PROJECT_INFO } from "../config/projectData.js";

function GithubIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function FinalCTA() {
  return (
    <section
      id="cta"
      style={{
        padding: "140px 24px",
        position: "relative",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <div className="bg-glow-orb-1" style={{ top: "10%", left: "30%" }} />

      <div style={{ maxWidth: 1250, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* LARGE OVERSIZED TYPOGRAPHY */}
          <h2
            style={{
              fontFamily: "'Syncopate', sans-serif",
              fontSize: "clamp(40px, 8vw, 110px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              margin: "0 auto 36px",
              color: "#FFFFFF",
              textTransform: "uppercase",
            }}
          >
            LET'S <br />
            UNDERSTAND <br />
            <span className="gradient-text-amber">THE MIND.</span>
          </h2>

          <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 640, margin: "0 auto 48px" }}>
            Explore the open source research repository, inspect structural feature extraction scripts, or test the interactive analysis prototype.
          </p>

          {/* 3 BUTTONS: VIEW PROJECT, EXPLORE RESULTS, GITHUB */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                const el = document.getElementById("prototype");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-amber-glow"
              style={{ padding: "16px 36px", fontSize: 16 }}
            >
              <Activity size={20} />
              <span>VIEW PROJECT DEMO</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("results");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-outline-amber"
              style={{ padding: "16px 32px", fontSize: 16 }}
            >
              <span>EXPLORE RESULTS</span>
              <ArrowUpRight size={18} />
            </button>

            <a
              href={PROJECT_INFO.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-outline-amber"
              style={{ padding: "16px 28px", fontSize: 16, textDecoration: "none" }}
            >
              <GithubIcon size={20} />
              <span>GITHUB</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
