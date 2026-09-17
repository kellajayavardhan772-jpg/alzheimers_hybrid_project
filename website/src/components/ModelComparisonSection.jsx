import React from "react";
import { motion } from "framer-motion";
import { MODEL_COMPARISONS, PERFORMANCE_METRICS } from "../config/projectData.js";
import { Cpu, Atom, Clock, Zap } from "lucide-react";

export default function ModelComparisonSection() {
  return (
    <section
      id="comparison"
      style={{
        padding: "120px 24px",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <span className="section-label">// SECTION 11 — BENCHMARK MATRIX & HARDWARE SPEEDUP</span>
        <h2 className="section-heading-lg">
          MACHINE LEARNING VS <br />
          <span className="gradient-text-amber">QUANTUM COMPUTING BENCHMARK</span>
        </h2>

        <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 680, marginBottom: 48 }}>
          Empirical evaluation comparing multi-algorithm Machine Learning pipelines running on CPU Processors against Quantum Computing models accelerated on GPU QPU Graphics Cards.
        </p>

        {/* SPEEDUP METRIC CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 40 }}>
          <div className="glass-panel" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#F59E0B", marginBottom: 12 }}>
              <Cpu size={20} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>MACHINE LEARNING (CPU)</span>
            </div>
            <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 26, fontWeight: 800, color: "#FFF" }}>
              180.0 sec (3.0 min)
            </div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Processor 16-Core Threads Execution</div>
          </div>

          <div className="glass-panel" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#A855F7", marginBottom: 12 }}>
              <Atom size={20} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>QUANTUM COMPUTING (GPU)</span>
            </div>
            <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 26, fontWeight: 800, color: "#A855F7" }}>
              12.0 sec (0.2 min)
            </div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>GPU QPU Graphics Card Acceleration</div>
          </div>

          <div className="glass-panel" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#10B981", marginBottom: 12 }}>
              <Zap size={20} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>HARDWARE SPEEDUP</span>
            </div>
            <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 26, fontWeight: 800, color: "#10B981" }}>
              15× Acceleration
            </div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Faster Execution on Quantum GPU</div>
          </div>
        </div>

        {/* COMPARISON TABLE CONTAINER */}
        <div className="glass-panel" style={{ padding: 24, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontFamily: "'Urbanist', sans-serif" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <th style={{ padding: "16px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#F59E0B" }}>
                  ALGORITHM
                </th>
                <th style={{ padding: "16px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#94A3B8" }}>
                  PARADIGM
                </th>
                <th style={{ padding: "16px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#94A3B8" }}>
                  HARDWARE ARCHITECTURE
                </th>
                <th style={{ padding: "16px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#94A3B8" }}>
                  ACCURACY
                </th>
                <th style={{ padding: "16px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#94A3B8" }}>
                  EXECUTION TIME
                </th>
              </tr>
            </thead>
            <tbody>
              {MODEL_COMPARISONS.map((m, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                    backgroundColor: m.type === "Quantum Computing" ? "rgba(168, 85, 247, 0.06)" : "transparent",
                  }}
                >
                  <td style={{ padding: "16px 12px", fontWeight: 700, color: m.type === "Quantum Computing" ? "#A855F7" : "#FFF" }}>
                    {m.name} {m.highlight && <span className="badge-amber" style={{ marginLeft: 8, fontSize: 9 }}>FEATURED</span>}
                  </td>
                  <td style={{ padding: "16px 12px", fontSize: 13, color: "#94A3B8" }}>{m.type}</td>
                  <td style={{ padding: "16px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: m.type === "Quantum Computing" ? "#A855F7" : "#F59E0B" }}>
                    {m.hardware}
                  </td>
                  <td style={{ padding: "16px 12px", fontFamily: "'Syncopate', sans-serif", fontSize: 14, fontWeight: 700, color: "#FFF" }}>
                    {m.accuracy}
                  </td>
                  <td style={{ padding: "16px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: m.type === "Quantum Computing" ? "#10B981" : "#E2E8F0" }}>
                    {m.executionTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
