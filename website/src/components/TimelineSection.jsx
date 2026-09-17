import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { RESEARCH_TIMELINE } from "../config/projectData.js";

export default function TimelineSection() {
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <section
      id="timeline"
      style={{
        padding: "120px 24px",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(14, 16, 23, 0.4)",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <span className="section-label">// SECTION 12 — RESEARCH ROADMAP</span>
        <h2 className="section-heading-lg">
          INTERACTIVE <br />
          <span className="gradient-text-amber">RESEARCH TIMELINE</span>
        </h2>

        <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 640, marginBottom: 48 }}>
          Click any phase to expand detailed technical objectives and milestone achievements.
        </p>

        {/* HORIZONTAL EXPANDABLE TIMELINE CARDS */}
        <div
          className="horizontal-scroll-row"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {RESEARCH_TIMELINE.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <motion.div
                key={idx}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                whileHover={{ scale: 1.02 }}
                className="glass-panel"
                style={{
                  padding: 20,
                  cursor: "pointer",
                  border: isExpanded ? "1px solid #F59E0B" : "1px solid rgba(255, 255, 255, 0.08)",
                  backgroundColor: isExpanded ? "rgba(245, 158, 11, 0.12)" : "rgba(14, 16, 23, 0.75)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: isExpanded ? 240 : 160,
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>
                      {item.stage}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: item.status === "Completed" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        color: item.status === "Completed" ? "#10B981" : "#F59E0B",
                      }}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 13, fontWeight: 700, color: "#FFF", marginBottom: 8 }}>
                    {item.title}
                  </h3>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.5, marginTop: 8 }}
                      >
                        {item.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div style={{ marginTop: 12, fontSize: 11, color: "#94A3B8", display: "flex", alignItems: "center", gap: 4 }}>
                  <span>{isExpanded ? "Click to collapse" : "Click to expand"}</span>
                  <ChevronRight size={12} style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
