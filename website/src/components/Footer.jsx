import React from "react";
import { Brain, ArrowUp, Code2, ShieldAlert } from "lucide-react";
import { PROJECT_INFO } from "../config/projectData.js";

function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        padding: "80px 24px 40px",
        backgroundColor: "#030406",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        color: "#94A3B8",
        fontFamily: "'Urbanist', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 48,
            marginBottom: 60,
          }}
        >
          {/* BRAND & DESCRIPTION */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#F59E0B",
                }}
              >
                <Brain size={18} />
              </div>
              <div style={{ fontFamily: "'Syncopate', sans-serif", fontWeight: 800, fontSize: 18, color: "#FFF" }}>
                ALZHEIMER'S<span style={{ color: "#F59E0B" }}>.AI</span>
              </div>
            </div>

            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#94A3B8", marginBottom: 20 }}>
              AI-Powered early Alzheimer's disease detection using deep convolutional feature learning, structural MRI morphometry, and hybrid quantum variational circuits.
            </p>

            <div className="badge-amber" style={{ fontSize: 10 }}>
              RESEARCH & EDUCATIONAL PROTOTYPE
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#F59E0B", marginBottom: 16 }}>
              NAVIGATION ANCHORS
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              <li>
                <a href="#about" style={{ color: "#CBD5E1", textDecoration: "none" }}>Research Overview</a>
              </li>
              <li>
                <a href="#approach" style={{ color: "#CBD5E1", textDecoration: "none" }}>5-Stage Methodology</a>
              </li>
              <li>
                <a href="#prototype" style={{ color: "#CBD5E1", textDecoration: "none" }}>Interactive Scanner Demo</a>
              </li>
              <li>
                <a href="#performance" style={{ color: "#CBD5E1", textDecoration: "none" }}>Performance Metrics</a>
              </li>
              <li>
                <a href="#quantum" style={{ color: "#CBD5E1", textDecoration: "none" }}>Quantum AI Research</a>
              </li>
            </ul>
          </div>

          {/* TECH STACK RECAP */}
          <div>
            <h4 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#F59E0B", marginBottom: 16 }}>
              STACK & DEPENDENCIES
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Python 3.10", "TensorFlow", "PyTorch", "OpenCV", "Scikit-Learn", "FastAPI", "React 18", "Vite", "Recharts"].map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    padding: "4px 10px",
                    borderRadius: 6,
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "#CBD5E1",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER BAR */}
        <div
          style={{
            paddingTop: 32,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            fontSize: 13,
          }}
        >
          <div>
            © {new Date().getFullYear()} <strong>ALZHEIMER'S RESEARCH PROJECT</strong>. All rights reserved.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a
              href={PROJECT_INFO.githubUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#94A3B8", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
            >
              <GithubIcon size={16} />
              <span>GitHub Repository</span>
            </a>

            <button
              onClick={scrollToTop}
              style={{
                background: "none",
                border: "none",
                color: "#F59E0B",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
              }}
            >
              <span>BACK TO TOP</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
