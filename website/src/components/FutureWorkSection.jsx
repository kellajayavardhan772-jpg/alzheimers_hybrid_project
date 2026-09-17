import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Layers, Database, Eye, GitBranch, ShieldAlert, Cpu, Stethoscope } from "lucide-react";
import { FUTURE_WORK } from "../config/projectData.js";

const iconList = [Eye, Layers, Database, Cpu, Stethoscope];

export default function FutureWorkSection() {
  return (
    <section
      id="future"
      style={{
        padding: "120px 24px",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <span className="section-label">// SECTION 15 — ROADMAP & FUTURE WORK</span>
        <h2 className="section-heading-lg">
          WHAT COMES <br />
          <span className="gradient-text-amber">NEXT</span>
        </h2>

        <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 640, marginBottom: 48 }}>
          Strategic research vectors for advancing model robustness, explainable diagnostics, multi-modal signal fusion, and QPU quantum acceleration.
        </p>

        {/* FUTURE ROADMAP GRID CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {FUTURE_WORK.map((fw, idx) => {
            const Icon = iconList[idx % iconList.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4, borderColor: "#F59E0B" }}
                className="glass-panel"
                style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ padding: 8, borderRadius: 8, background: "rgba(245, 158, 11, 0.12)", color: "#F59E0B" }}>
                      <Icon size={20} />
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#F59E0B" }}>
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#FFF", marginBottom: 8 }}>{fw.title}</h3>
                  <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{fw.desc}</p>
                </div>

                <div
                  style={{
                    marginTop: 20,
                    paddingTop: 12,
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: "#64748B",
                  }}
                >
                  TARGET: PHASE 0{idx + 2} RESEARCH
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
