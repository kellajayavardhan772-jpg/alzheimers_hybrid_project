import React, { useState } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { PERFORMANCE_METRICS } from "../config/projectData.js";

export default function PerformanceSection() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <section
      id="performance"
      style={{
        padding: "120px 24px",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(14, 16, 23, 0.4)",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <span className="section-label">// SECTION 08 — PERFORMANCE METRICS</span>
        <h2 className="section-heading-lg">
          MEASURE <br />
          <span className="gradient-text-amber">THE RESULT</span>
        </h2>

        {/* TOP METRICS HIGHLIGHT CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 48,
          }}
        >
          {[
            { label: "ACCURACY", value: PERFORMANCE_METRICS.overallAccuracy },
            { label: "PRECISION", value: PERFORMANCE_METRICS.precision },
            { label: "RECALL", value: PERFORMANCE_METRICS.recall },
            { label: "F1 SCORE", value: PERFORMANCE_METRICS.f1Score },
            { label: "ROC-AUC", value: PERFORMANCE_METRICS.aucRoc },
          ].map((m, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.02 }} className="glass-panel" style={{ padding: 20 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#94A3B8" }}>{m.label}</div>
              <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 28, fontWeight: 800, color: "#F59E0B", marginTop: 8 }}>
                {m.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* INTERACTIVE CHART & CONFUSION MATRIX GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 32 }}>
          {/* LEFT: EPOCH ACCURACY TRAINING CURVE CHART */}
          <div className="glass-panel" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 15, fontWeight: 700, color: "#FFF" }}>
                TRAINING ACCURACY CURVE
              </h3>
              <span className="badge-amber">20 EPOCHS</span>
            </div>

            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PERFORMANCE_METRICS.epochHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="epoch" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0E1017",
                      borderColor: "rgba(245, 158, 11, 0.4)",
                      borderRadius: 8,
                      color: "#FFF",
                    }}
                  />
                  <Line type="monotone" dataKey="accuracy" stroke="#F59E0B" strokeWidth={3} dot={{ fill: "#F59E0B", r: 4 }} />
                  <Line type="monotone" dataKey="valAccuracy" stroke="#38BDF8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 12, fontSize: 12, color: "#94A3B8" }}>
              <span style={{ color: "#F59E0B" }}>— Training Accuracy</span>
              <span style={{ color: "#38BDF8" }}>--- Validation Accuracy</span>
            </div>
          </div>

          {/* RIGHT: CONFUSION MATRIX HEATMAP */}
          <div className="glass-panel" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 15, fontWeight: 700, color: "#FFF" }}>
                4×4 CONFUSION MATRIX
              </h3>
              <span className="badge-amber">TEST SUBSET</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, textAlign: "center" }}>
              {PERFORMANCE_METRICS.confusionMatrix.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  const isDiag = rIdx === cIdx;
                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      style={{
                        padding: "16px 8px",
                        borderRadius: 8,
                        backgroundColor: isDiag ? "rgba(245, 158, 11, 0.25)" : "rgba(255, 255, 255, 0.03)",
                        border: isDiag ? "1px solid #F59E0B" : "1px solid rgba(255, 255, 255, 0.05)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      <div style={{ fontSize: 16, fontWeight: 700, color: isDiag ? "#F59E0B" : "#94A3B8" }}>{val}</div>
                      <div style={{ fontSize: 9, color: "#64748B", marginTop: 4 }}>
                        {PERFORMANCE_METRICS.labels[rIdx].slice(0, 4)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ marginTop: 20, fontSize: 12, color: "#94A3B8", textAlign: "center" }}>
              Diagonal elements represent correct classification predictions across all 4 disease stages.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
