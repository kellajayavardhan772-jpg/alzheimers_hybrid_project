import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Layers, AlertCircle, Sparkles, MoveRight } from "lucide-react";

export default function ChallengeSection() {
  const [activeTab, setActiveTab] = useState(0);

  const challenges = [
    {
      title: "Memory & Cognitive Decline Pathopathology",
      desc: "Alzheimer's disease damages neural pathways long before clinical memory loss becomes apparent. Understanding early structural alterations requires deep spatial analysis.",
      metric: "Early Window",
      tag: "PATHOLOGY",
      image: "/images/mri_coronal_slice.png",
    },
    {
      title: "Diagnostic Complexity & Multi-modal Assessment",
      desc: "Definitive early diagnosis can be challenging and often requires combining cognitive batteries, CSF biomarkers, and high-resolution neuroimaging.",
      metric: "Multi-Modal",
      tag: "DIAGNOSTICS",
      image: "/images/eeg_coherence.png",
    },
    {
      title: "Structural Biomarkers in Medical Imaging",
      desc: "T1-weighted structural MRI scans contain subtle morphometric signals, such as hippocampal shrinkage and ventricular enlargement, that are difficult to quantify manually.",
      metric: "T1 Structural MRI",
      tag: "NEUROIMAGING",
      image: "/images/mri_3d_ventricular.png",
    },
    {
      title: "AI-Assisted Pattern Recognition",
      desc: "Deep learning convolution filters extract fine-grained spatial features across coronal and sagittal brain slices to aid researchers in objective multi-stage classification.",
      metric: "Feature Extraction",
      tag: "DEEP LEARNING",
      image: "/images/gradcam_heatmap.png",
    },
  ];

  return (
    <section
      id="challenge"
      style={{
        padding: "120px 24px",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <span className="section-label">// SECTION 03 — PROBLEM STATEMENT</span>
        <h2 className="section-heading-lg">
          THE <br />
          <span className="gradient-text-amber">CHALLENGE</span>
        </h2>

        {/* INTERACTIVE SCROLLABLE GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 32,
            marginTop: 48,
          }}
        >
          {/* LEFT: 4 KEY CHALLENGE CARDS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {challenges.map((item, idx) => (
              <motion.div
                key={idx}
                onClick={() => setActiveTab(idx)}
                whileHover={{ scale: 1.01 }}
                style={{
                  padding: 24,
                  borderRadius: 16,
                  backgroundColor: activeTab === idx ? "rgba(245, 158, 11, 0.1)" : "rgba(14, 16, 23, 0.7)",
                  border: activeTab === idx ? "1px solid #F59E0B" : "1px solid rgba(255, 255, 255, 0.08)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span className="badge-amber">{item.tag}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#94A3B8" }}>
                    0{idx + 1}
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#FFF", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* RIGHT: INTERACTIVE MRI BRAIN SCAN VIEWER */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-panel"
            style={{
              padding: 32,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 460,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Brain size={22} style={{ color: "#F59E0B" }} />
                  <span style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 14, fontWeight: 700, color: "#FFF" }}>
                    STRUCTURAL BRAIN ANALYSIS
                  </span>
                </div>
                <div className="badge-amber">{challenges[activeTab].metric}</div>
              </div>

              {/* Simulated Interactive High-Res MRI Canvas Preview */}
              <div
                style={{
                  width: "100%",
                  height: 290,
                  borderRadius: 14,
                  backgroundColor: "#030406",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={challenges[activeTab].image}
                  alt={challenges[activeTab].title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    filter: "brightness(0.95) contrast(1.1)",
                  }}
                />
                <div className="scan-laser-line" />

                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: "#F59E0B",
                    background: "rgba(0,0,0,0.75)",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    padding: "4px 10px",
                    borderRadius: 4,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  ROI ATROPHY DETECTED
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: 13, color: "#94A3B8", fontFamily: "'Urbanist', sans-serif" }}>
                Targeting accurate hippocampal segmentation and ventricular ratio computation via automated ML pipelines.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
