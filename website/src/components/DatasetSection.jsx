import React from "react";
import { motion } from "framer-motion";
import { Database, Image as ImageIcon, PieChart, Layers, CheckCircle } from "lucide-react";
import { DATASET_CONFIG } from "../config/projectData.js";

export default function DatasetSection() {
  return (
    <section
      id="data"
      style={{
        padding: "120px 24px",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <span className="section-label">// SECTION 07 — DATASET SPECIFICATION</span>
        <h2 className="section-heading-lg">
          THE <br />
          <span className="gradient-text-amber">DATA</span>
        </h2>

        <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 640, marginBottom: 48 }}>
          Curated multi-class T1-weighted structural brain MRI scan corpus standardized for machine learning benchmarks.
        </p>

        {/* METRICS & SPLIT CARDS GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginBottom: 48,
          }}
        >
          <motion.div whileHover={{ y: -4 }} className="glass-panel" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#F59E0B", marginBottom: 12 }}>
              <Database size={20} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>TOTAL IMAGES</span>
            </div>
            <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 26, fontWeight: 800, color: "#FFF" }}>
              {DATASET_CONFIG.totalImages}
            </div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Standardized MRI Slices</div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="glass-panel" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#F59E0B", marginBottom: 12 }}>
              <ImageIcon size={20} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>DIMENSIONS</span>
            </div>
            <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 24, fontWeight: 800, color: "#FFF" }}>
              {DATASET_CONFIG.imageDimensions}
            </div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Format: {DATASET_CONFIG.format}</div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="glass-panel" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#F59E0B", marginBottom: 12 }}>
              <PieChart size={20} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>TRAINING SPLIT</span>
            </div>
            <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 24, fontWeight: 800, color: "#FFF" }}>
              {DATASET_CONFIG.split.train}
            </div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>70% Train Subset</div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="glass-panel" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#F59E0B", marginBottom: 12 }}>
              <Layers size={20} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>CLASSES</span>
            </div>
            <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 26, fontWeight: 800, color: "#F59E0B" }}>
              {DATASET_CONFIG.classesCount} Categories
            </div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Multi-Stage Spectrum</div>
          </motion.div>
        </div>

        {/* PREPROCESSING PIPELINE LIST */}
        <div className="glass-panel" style={{ padding: 32 }}>
          <h3 style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 18, fontWeight: 700, color: "#FFF", marginBottom: 20 }}>
            STANDARDIZED PREPROCESSING STEPS
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {DATASET_CONFIG.preprocessingSteps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  padding: 16,
                  borderRadius: 10,
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <CheckCircle size={18} style={{ color: "#F59E0B", marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: "#E2E8F0" }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
