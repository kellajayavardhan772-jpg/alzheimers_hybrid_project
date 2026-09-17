import React from "react";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import { PROJECT_INFO } from "../config/projectData.js";

export default function DisclaimerBanner() {
  return (
    <section
      id="disclaimer"
      style={{
        padding: "60px 24px",
        backgroundColor: "rgba(245, 158, 11, 0.06)",
        borderTop: "1px solid rgba(245, 158, 11, 0.3)",
        borderBottom: "1px solid rgba(245, 158, 11, 0.3)",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <ShieldAlert size={22} style={{ color: "#F59E0B" }} />
          <span style={{ fontFamily: "'Syncopate', sans-serif", fontSize: 14, fontWeight: 800, color: "#F59E0B", letterSpacing: "0.1em" }}>
            MEDICAL RESEARCH DISCLAIMER
          </span>
        </div>

        <p
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "#E2E8F0",
            maxWidth: 900,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          "{PROJECT_INFO.disclaimer}"
        </p>
      </div>
    </section>
  );
}
