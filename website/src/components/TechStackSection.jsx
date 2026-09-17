import React from "react";
import { motion } from "framer-motion";
import { Code2, Layers, Cpu, BarChart3, Eye, Binary, Table, Server, Atom, Zap } from "lucide-react";
import { TECH_STACK } from "../config/projectData.js";

const iconMap = {
  Code2,
  Layers,
  Cpu,
  BarChart3,
  Eye,
  Binary,
  Table,
  Server,
  Atom,
  Zap,
};

export default function TechStackSection() {
  return (
    <section
      id="techstack"
      style={{
        padding: "120px 24px",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <span className="section-label">// SECTION 13 — TECHNOLOGY STACK</span>
        <h2 className="section-heading-lg">
          BUILT <br />
          <span className="gradient-text-amber">WITH</span>
        </h2>

        <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 640, marginBottom: 48 }}>
          Modern machine learning, computer vision, and reactive frontend technologies empowering this research environment.
        </p>

        {/* ANIMATED TECH GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {TECH_STACK.map((tech, idx) => {
            const IconComponent = iconMap[tech.icon] || Code2;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -4, borderColor: "#F59E0B" }}
                className="glass-panel"
                style={{ padding: 24, display: "flex", alignItems: "center", gap: 16 }}
              >
                <div style={{ padding: 12, borderRadius: 10, background: "rgba(245, 158, 11, 0.12)", color: "#F59E0B" }}>
                  <IconComponent size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#FFF", marginBottom: 2 }}>{tech.name}</h3>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#94A3B8" }}>
                    {tech.cat}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
