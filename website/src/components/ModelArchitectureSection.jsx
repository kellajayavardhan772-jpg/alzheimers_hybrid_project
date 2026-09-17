import React, { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Layers, Image as ImageIcon, Sparkles, Filter, Grid, Target } from "lucide-react";

export default function ModelArchitectureSection() {
  const [activeStage, setActiveStage] = useState(0);

  const pipelineNodes = [
    {
      id: "input",
      title: "INPUT IMAGE",
      tensor: "224 × 224 × 1",
      desc: "Preprocessed T1-weighted structural coronal MRI brain slice scaled and normalized.",
      details: ["Grayscale Channel", "Skull Stripped", "MNI152 Standard Space"],
      icon: ImageIcon,
    },
    {
      id: "conv",
      title: "CONVOLUTION (Conv2D)",
      tensor: "220 × 220 × 32",
      desc: "3×3 Learnable convolution kernel filters extracting edge, gradient, and intensity patterns.",
      details: ["32 Feature Maps", "ReLU Activation", "Spatial Gradient Filtering"],
      icon: Filter,
    },
    {
      id: "features",
      title: "FEATURE EXTRACTION",
      tensor: "110 × 110 × 64",
      desc: "Deeper convolutional layers extract complex anatomical biomarkers (hippocampal contours & ventricular boundaries).",
      details: ["Hierarchical Patterns", "Cortical Thickness Maps", "Deep Spatial Features"],
      icon: Layers,
    },
    {
      id: "pooling",
      title: "MAX POOLING",
      tensor: "55 × 55 × 64",
      desc: "2×2 Max pooling downsamples spatial dimensionality while preserving dominant features and translation invariance.",
      details: ["Dimensionality Reduction", "Feature Invariance", "Parameter Optimization"],
      icon: Grid,
    },
    {
      id: "dense",
      title: "DENSE CLASSIFICATION",
      tensor: "512 Vector → 4 Dense",
      desc: "Flattened feature vector passed through fully-connected layers with dropout regularization.",
      details: ["512 Hidden Units", "Dropout (p=0.4)", "Softmax Activation"],
      icon: Cpu,
    },
    {
      id: "output",
      title: "STAGE OUTPUT",
      tensor: "4 Probability Scores",
      desc: "Final multi-class probability output classifying Non-Demented, Very Mild, Mild, or Moderate stage.",
      details: ["Non-Demented", "Very Mild Demented", "Mild Demented", "Moderate Demented"],
      icon: Target,
    },
  ];

  return (
    <section
      id="intelligence"
      style={{
        padding: "120px 24px",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(14, 16, 23, 0.4)",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <span className="section-label">// SECTION 06 — NEURAL ARCHITECTURE</span>
        <h2 className="section-heading-lg">
          THE INTELLIGENCE <br />
          <span className="gradient-text-amber">BEHIND THE SYSTEM</span>
        </h2>

        <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 640, marginBottom: 48 }}>
          Deep learning convolutional neural network architecture optimized for multi-stage neurodegenerative feature learning.
        </p>

        {/* PIPELINE STAGES GRID & DIAGRAM */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          {/* LEFT: INTERACTIVE PIPELINE SELECTOR */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pipelineNodes.map((node, index) => {
              const Icon = node.icon;
              return (
                <motion.div
                  key={node.id}
                  onClick={() => setActiveStage(index)}
                  whileHover={{ x: 6 }}
                  style={{
                    padding: "16px 20px",
                    borderRadius: 12,
                    backgroundColor: activeStage === index ? "rgba(245, 158, 11, 0.12)" : "rgba(14, 16, 23, 0.7)",
                    border: activeStage === index ? "1px solid #F59E0B" : "1px solid rgba(255, 255, 255, 0.08)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        background: activeStage === index ? "#F59E0B" : "rgba(255,255,255,0.05)",
                        color: activeStage === index ? "#000" : "#F59E0B",
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#FFF" }}>{node.title}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#94A3B8" }}>
                        {node.tensor}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#F59E0B" }}>
                    0{index + 1}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: DETAILED ARCHITECTURE DISPLAY CARD */}
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-panel"
            style={{
              padding: 36,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span className="badge-amber">LAYER SPECIFICATION // 0{activeStage + 1}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#94A3B8" }}>
                  TENSOR: {pipelineNodes[activeStage].tensor}
                </span>
              </div>

              <h3 style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 22, fontWeight: 800, color: "#FFF", marginBottom: 16 }}>
                {pipelineNodes[activeStage].title}
              </h3>

              <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.6, marginBottom: 28 }}>
                {pipelineNodes[activeStage].desc}
              </p>

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#F59E0B", marginBottom: 12 }}>
                KEY COMPUTATIONAL METRICS:
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {pipelineNodes[activeStage].details.map((detail, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      fontSize: 14,
                      color: "#E2E8F0",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div className="pulsing-dot" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: 32,
                paddingTop: 16,
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#94A3B8",
              }}
            >
              PIPELINE SPEED: ~18ms / frame on GPU inference
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
