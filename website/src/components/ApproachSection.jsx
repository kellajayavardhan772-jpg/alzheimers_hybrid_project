import React from "react";
import { motion } from "framer-motion";
import { Database, Filter, Cpu, Target, BarChart2, ArrowRight } from "lucide-react";

export default function ApproachSection() {
  const stages = [
    {
      step: "01",
      title: "DATA ACQUISITION",
      sub: "Medical Images / MRI Scans",
      desc: "Standardized T1-weighted structural MRI brain scans acquired in axial, coronal, and sagittal orientations.",
      icon: Database,
    },
    {
      step: "02",
      title: "PREPROCESSING",
      sub: "Cleaning & Normalization",
      desc: "Skull stripping, intensity normalization, bicubic spatial scaling (224×224), and contrast enhancement.",
      icon: Filter,
    },
    {
      step: "03",
      title: "FEATURE LEARNING",
      sub: "Deep Convolutional Neural Nets",
      desc: "Multi-layered 2D CNN filters learn spatial textures, cortical thickness variations, and hippocampal structures.",
      icon: Cpu,
    },
    {
      step: "04",
      title: "CLASSIFICATION",
      sub: "Multi-Class Disease Stage Prediction",
      desc: "Softmax probability distribution predicts non-demented, very mild, mild, or moderate Alzheimer's stage.",
      icon: Target,
    },
    {
      step: "05",
      title: "ANALYSIS",
      sub: "Performance & Explainability",
      desc: "Evaluation via confusion matrix, ROC-AUC curves, F1-scores, and Grad-CAM spatial activation heatmaps.",
      icon: BarChart2,
    },
  ];

  return (
    <section
      id="approach"
      style={{
        padding: "120px 24px",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(14, 16, 23, 0.4)",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <span className="section-label">// SECTION 04 — METHODOLOGY</span>
        <h2 className="section-heading-lg">
          FROM IMAGE <br />
          <span className="gradient-text-amber">TO INSIGHT</span>
        </h2>

        <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 640, marginBottom: 48 }}>
          A 5-stage systematic pipeline converting raw DICOM/PNG MRI slice inputs into actionable diagnostic intelligence.
        </p>

        {/* SEQUENTIAL ANIMATED STAGES ROW */}
        <div
          className="horizontal-scroll-row"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {stages.map((st, i) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="glass-panel"
                style={{
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 280,
                  position: "relative",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 24, fontWeight: 800, color: "#F59E0B" }}>
                      {st.step}
                    </span>
                    <div style={{ padding: 8, borderRadius: 8, background: "rgba(245, 158, 11, 0.12)", color: "#F59E0B" }}>
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 14, fontWeight: 700, color: "#FFF", marginBottom: 6 }}>
                    {st.title}
                  </h3>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#F59E0B", marginBottom: 12 }}>
                    {st.sub}
                  </div>
                  <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5 }}>{st.desc}</p>
                </div>

                {i < stages.length - 1 && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                    <ArrowRight size={16} style={{ color: "rgba(255,255,255,0.2)" }} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
