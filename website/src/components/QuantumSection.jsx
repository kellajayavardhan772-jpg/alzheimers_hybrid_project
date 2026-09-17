import React from "react";
import { motion } from "framer-motion";
import { Cpu, Zap, ArrowRight, ShieldCheck, Layers, GitCompare } from "lucide-react";
import { QUANTUM_RESEARCH } from "../config/projectData.js";

export default function QuantumSection() {
  return (
    <section
      id="quantum"
      style={{
        padding: "120px 24px",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(14, 16, 23, 0.4)",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <span className="section-label">// SECTION 10 — QUANTUM MACHINE LEARNING</span>
        <h2 className="section-heading-lg">
          BEYOND <br />
          <span className="gradient-text-amber">CLASSICAL AI</span>
        </h2>

        <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 720, marginBottom: 48 }}>
          {QUANTUM_RESEARCH.description}
        </p>

        {/* ANIMATED 5-STEP PIPELINE TRANSITION */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#F59E0B", marginBottom: 20 }}>
            HYBRID QUANTUM-CLASSICAL PIPELINE FLOW:
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {QUANTUM_RESEARCH.pipeline.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel"
                style={{ padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              >
                <div>
                  <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 16, fontWeight: 800, color: "#F59E0B", marginBottom: 8 }}>
                    {p.step}
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#FFF", marginBottom: 6 }}>{p.title}</h4>
                  <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>{p.desc}</p>
                </div>

                {idx < QUANTUM_RESEARCH.pipeline.length - 1 && (
                  <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                    <ArrowRight size={14} style={{ color: "rgba(245, 158, 11, 0.4)" }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* COMPARISON AREA: CLASSICAL ML vs QUANTUM ML */}
        <div className="glass-panel" style={{ padding: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <GitCompare size={22} style={{ color: "#F59E0B" }} />
            <h3 style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 18, fontWeight: 700, color: "#FFF" }}>
              EXPERIMENTAL COMPARISON: CLASSICAL ML VS HYBRID QUANTUM ML
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {/* CLASSICAL ML BOX */}
            <div
              style={{
                padding: 24,
                borderRadius: 14,
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#38BDF8", marginBottom: 8 }}>
                CLASSICAL CONVOLUTIONAL MODEL
              </div>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: "#FFF", marginBottom: 12 }}>ResNet-50 CNN</h4>
              <ul style={{ paddingLeft: 18, fontSize: 14, color: "#CBD5E1", lineHeight: 1.8 }}>
                <li>Validation Accuracy: <strong>96.4%</strong></li>
                <li>Training Time: ~42 min on GPU</li>
                <li>High spatial feature accuracy for 2D slices</li>
                <li>Proven stability on large datasets</li>
              </ul>
            </div>

            {/* QUANTUM HYBRID BOX */}
            <div
              style={{
                padding: 24,
                borderRadius: 14,
                backgroundColor: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
              }}
            >
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#F59E0B", marginBottom: 8 }}>
                HYBRID QUANTUM-CLASSICAL MODEL
              </div>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: "#FFF", marginBottom: 12 }}>Qiskit 8-Qubit VQC</h4>
              <ul style={{ paddingLeft: 18, fontSize: 14, color: "#CBD5E1", lineHeight: 1.8 }}>
                <li>Validation Accuracy: <strong>91.8%</strong> (Experimental)</li>
                <li>Simulated Training Time: ~68 min</li>
                <li>Explores exponential Hilbert state representations</li>
                <li>Requires future hardware QPU scaling</li>
              </ul>
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              paddingTop: 16,
              borderTop: "1px dashed rgba(255,255,255,0.1)",
              fontSize: 12,
              color: "#94A3B8",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ShieldCheck size={16} style={{ color: "#F59E0B" }} />
            <span>Note: Quantum ML is an exploratory research track. Classical deep CNN currently maintains higher validation accuracy.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
