import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Layers, Image as ImageIcon, Sparkles, ZoomIn, Eye } from "lucide-react";

export default function GallerySection() {
  const [activeItem, setActiveItem] = useState(null);

  const galleryItems = [
    {
      title: "Coronal MRI Slice — Hippocampal Section",
      cat: "STRUCTURAL MRI",
      desc: "High-contrast T1-weighted coronal MRI view targeting bilateral hippocampal volume measurement.",
      color: "rgba(245, 158, 11, 0.2)",
      img: "images/mri_coronal_slice.png",
    },
    {
      title: "Grad-CAM Feature Activation Map",
      cat: "EXPLAINABLE AI",
      desc: "Spatial heatmap highlighting localized neural network decision weights across medial temporal lobes.",
      color: "rgba(255, 107, 0, 0.2)",
      img: "images/gradcam_heatmap.png",
    },
    {
      title: "3D Ventricular Atrophy Render",
      cat: "3D MODELING",
      desc: "Volumetric spatial reconstruction illustrating lateral ventricular dilatation patterns.",
      color: "rgba(245, 158, 11, 0.2)",
      img: "images/mri_3d_ventricular.png",
    },
    {
      title: "Confusion Matrix & ROC-AUC",
      cat: "MODEL EVALUATION",
      desc: "Comprehensive multi-class performance statistics across 960 test scan slices.",
      color: "rgba(56, 189, 248, 0.2)",
      img: "images/confusion_matrix.png",
    },
    {
      title: "EEG Alpha-Band Coherence Pairs",
      cat: "MULTI-MODAL SIGNAL",
      desc: "Cross-channel coherence spectra calculated across occipital and frontal EEG leads.",
      color: "rgba(245, 158, 11, 0.2)",
      img: "images/eeg_coherence.png",
    },
    {
      title: "Quantum State Angle Encoding Circuit",
      cat: "QUANTUM AI",
      desc: "8-qubit variational circuit diagram encoding classical feature tensors into quantum Hilbert space.",
      color: "rgba(168, 85, 247, 0.2)",
      img: "images/quantum_circuit.png",
    },
  ];

  return (
    <section
      id="gallery"
      style={{
        padding: "120px 24px",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(14, 16, 23, 0.4)",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <span className="section-label">// SECTION 14 — VISUAL MEDIA</span>
        <h2 className="section-heading-lg">
          PROJECT <br />
          <span className="gradient-text-amber">GALLERY</span>
        </h2>

        <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 640, marginBottom: 48 }}>
          Cinematic collection of neuroimaging slices, feature heatmaps, model architectures, and experimental diagnostic outputs.
        </p>

        {/* GALLERY GRID WITH HOVER PARALLAX / TILT */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {galleryItems.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="glass-panel"
              style={{
                padding: 24,
                borderRadius: 16,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 280,
                position: "relative",
                overflow: "hidden",
              }}
              onClick={() => setActiveItem(item)}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span className="badge-amber">{item.cat}</span>
                  <Eye size={16} style={{ color: "#94A3B8" }} />
                </div>

                {/* Simulated Cinematic Visual Display Box */}
                <div
                  style={{
                    width: "100%",
                    height: 150,
                    borderRadius: 10,
                    backgroundColor: "#030406",
                    border: "1px solid rgba(255,255,255,0.12)",
                    overflow: "hidden",
                    marginBottom: 16,
                    position: "relative",
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      filter: "brightness(0.95) contrast(1.05)",
                    }}
                  />
                  <div className="scan-laser-line" style={{ animationDuration: "5s" }} />
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#FFF", marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
