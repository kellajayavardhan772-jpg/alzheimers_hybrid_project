import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle, Info, Layers, Activity } from "lucide-react";
import { CLASSIFICATION_CLASSES } from "../config/projectData.js";

export default function ClassificationResultsSection() {
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);

  const selectedClass = CLASSIFICATION_CLASSES[selectedClassIndex];

  return (
    <section
      id="results"
      style={{
        padding: "120px 24px",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <span className="section-label">// SECTION 09 — DISEASE STAGE TAXONOMY</span>
        <h2 className="section-heading-lg">
          CLINICAL STAGE <br />
          <span className="gradient-text-amber">CLASSIFICATION</span>
        </h2>

        <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 640, marginBottom: 48 }}>
          The 4 clinical diagnostic categories identified by the CNN multi-class feature classifier.
        </p>

        {/* 4 CLASS TABS / CARDS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 32 }}>
          {CLASSIFICATION_CLASSES.map((cls, idx) => (
            <motion.div
              key={cls.id}
              onClick={() => setSelectedClassIndex(idx)}
              whileHover={{ scale: 1.02 }}
              style={{
                padding: 20,
                borderRadius: 14,
                backgroundColor: selectedClassIndex === idx ? "rgba(245, 158, 11, 0.14)" : "rgba(14, 16, 23, 0.7)",
                border: selectedClassIndex === idx ? "1px solid #F59E0B" : "1px solid rgba(255, 255, 255, 0.08)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span className="badge-amber">{cls.code}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#F59E0B" }}>
                  {cls.confidenceTarget}
                </span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#FFF", margin: "8px 0 4px" }}>{cls.name}</h3>
              <div style={{ fontSize: 12, color: "#94A3B8" }}>{cls.stage}</div>
            </motion.div>
          ))}
        </div>

        {/* ACTIVE CLASS DETAILED VIEW */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedClass.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass-panel"
            style={{
              padding: 36,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 36,
              alignItems: "center",
            }}
          >
            {/* LEFT: TEXT & NEUROLOGICAL BIOMARKERS */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <Brain size={24} style={{ color: "#F59E0B" }} />
                <span className="badge-amber">{selectedClass.code} SPECIFICATION</span>
              </div>

              <h3 style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 28, fontWeight: 800, color: "#FFF", marginBottom: 12 }}>
                {selectedClass.name}
              </h3>

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#F59E0B", marginBottom: 20 }}>
                STAGE: {selectedClass.stage} // SAMPLE COUNT: {selectedClass.count}
              </div>

              <p style={{ fontSize: 16, color: "#CBD5E1", lineHeight: 1.6, marginBottom: 24 }}>{selectedClass.fullDesc}</p>

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#94A3B8", marginBottom: 12 }}>
                TYPICAL STRUCTURAL MRI CHARACTERISTICS:
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {selectedClass.typicalFeatures.map((feat, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#E2E8F0" }}>
                    <CheckCircle size={16} style={{ color: "#F59E0B", flexShrink: 0 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: REAL MRI SCAN PREVIEW CARD */}
            <div
              style={{
                width: "100%",
                height: 310,
                borderRadius: 16,
                backgroundColor: "#030406",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={selectedClass.image}
                alt={`${selectedClass.name} MRI Scan`}
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
                  left: 14,
                  fontFamily: "'Syncopate', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#FFF",
                  background: "rgba(0,0,0,0.75)",
                  padding: "4px 10px",
                  borderRadius: 4,
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(4px)",
                }}
              >
                {selectedClass.name.toUpperCase()} MRI TENSOR
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 14,
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
                TARGET CONFIDENCE: {selectedClass.confidenceTarget}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
