import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Activity, Eye, FileText, CheckCircle2 } from "lucide-react";
import { DATASET_CONFIG } from "../config/projectData.js";

function AnimatedCounter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      style={{
        padding: "120px 24px",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(14, 16, 23, 0.4)",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <span className="section-label">// SECTION 02 — INTRODUCTION</span>
        <h2 className="section-heading-lg">
          UNDERSTANDING <br />
          <span className="gradient-text-amber">THE MIND</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 48,
            alignItems: "center",
            marginTop: 40,
          }}
        >
          {/* LEFT: PROFESSIONAL EXPLANATION TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: "#E2E8F0",
                marginBottom: 24,
                fontFamily: "'Urbanist', sans-serif",
              }}
            >
              Alzheimer’s disease is a progressive neurodegenerative disorder affecting memory, cognitive function,
              and structural brain volume. Early detection is critical, as pathological micro-structural changes
              begin years before overt clinical symptoms appear.
            </p>

            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: "#94A3B8",
                marginBottom: 32,
                fontFamily: "'Urbanist', sans-serif",
              }}
            >
              Our research framework leverages deep convolutional neural networks (CNNs) and high-resolution T1-weighted
              structural MRI scans to identify subtle hippocampal atrophy, entorhinal cortex thinning, and cerebral
              ventricular enlargement, assisting researchers in early-stage pattern recognition.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
              {[
                "High-precision structural feature extraction from T1-weighted MRI coronal slices",
                "Automated 4-stage disease severity classification protocol",
                "Experimental quantum variational circuit integration for high-dimensional feature spaces",
              ].map((point, index) => (
                <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <CheckCircle2 size={18} style={{ color: "#F59E0B", marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: "#CBD5E1" }}>{point}</span>
                </div>
              ))}
            </div>

            <div className="badge-amber" style={{ padding: "8px 16px" }}>
              <ShieldCheck size={14} />
              <span>RESEARCH & EDUCATIONAL AI PROTOTYPE</span>
            </div>
          </motion.div>

          {/* RIGHT: ANIMATED BRAIN / MRI VISUAL CONTAINER */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: "relative" }}
          >
            <div
              className="glass-panel"
              style={{
                position: "relative",
                overflow: "hidden",
                padding: 24,
                borderRadius: 20,
                textAlign: "center",
              }}
            >
              {/* MRI Visual Overlay Box */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 340,
                  borderRadius: 14,
                  backgroundColor: "#030406",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/images/mri_coronal_slice.png"
                  alt="Coronal T1 3D MRI Slice"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    filter: "brightness(0.95) contrast(1.1)",
                  }}
                />

                {/* Laser scan line overlay */}
                <div className="scan-laser-line" />

                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 16,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: "#F59E0B",
                    background: "rgba(0,0,0,0.75)",
                    border: "1px solid rgba(245,158,11,0.3)",
                    padding: "4px 10px",
                    borderRadius: 4,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  SLICING: CORONAL T1-3D // HIPPOCAMPUS FOCUS
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ANIMATED STATISTICS GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginTop: 64,
          }}
        >
          <div className="glass-panel" style={{ padding: 24 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#94A3B8" }}>GLOBAL IMPACT</div>
            <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 36, fontWeight: 700, color: "#F59E0B", margin: "12px 0 4px" }}>
              <AnimatedCounter end={55} suffix="M+" />
            </div>
            <div style={{ fontSize: 14, color: "#CBD5E1" }}>Alzheimer's & Dementia Cases Worldwide</div>
          </div>

          <div className="glass-panel" style={{ padding: 24 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#94A3B8" }}>BRAIN IMAGING CORPUS</div>
            <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 36, fontWeight: 700, color: "#FFF", margin: "12px 0 4px" }}>
              <AnimatedCounter end={6400} suffix=" Scans" />
            </div>
            <div style={{ fontSize: 14, color: "#CBD5E1" }}>Standardized MRI Brain Scan Dataset</div>
          </div>

          <div className="glass-panel" style={{ padding: 24 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#94A3B8" }}>AI-ASSISTED ACCURACY</div>
            <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 36, fontWeight: 700, color: "#F59E0B", margin: "12px 0 4px" }}>
              <AnimatedCounter end={96} suffix=".4%" />
            </div>
            <div style={{ fontSize: 14, color: "#CBD5E1" }}>Multi-Class Validation Metric</div>
          </div>

          <div className="glass-panel" style={{ padding: 24 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#94A3B8" }}>EARLY DETECTION</div>
            <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 36, fontWeight: 700, color: "#FFF", margin: "12px 0 4px" }}>
              <AnimatedCounter end={4} suffix=" Stages" />
            </div>
            <div style={{ fontSize: 14, color: "#CBD5E1" }}>Clinical Severity Classification</div>
          </div>
        </div>
      </div>
    </section>
  );
}
