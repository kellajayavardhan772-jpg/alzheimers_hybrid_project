import React, { useState, useEffect } from "react";
import { Brain, Cpu, Database, BarChart3, ChevronRight } from "lucide-react";

export default function HeaderNav({ user = null, onOpenAuth = () => {} }) {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Track active section
      const sections = [
        "hero",
        "about",
        "challenge",
        "approach",
        "prototype",
        "intelligence",
        "data",
        "performance",
        "results",
        "quantum",
        "comparison",
        "timeline",
        "techstack",
        "gallery",
        "future",
      ];

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? "12px 32px" : "20px 48px",
        backgroundColor: scrolled ? "rgba(7, 8, 11, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid transparent",
        transition: "all 0.4s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* BRAND / LOGO */}
      <div
        onClick={() => scrollTo("hero")}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
      >
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
        <div style={{ fontFamily: "'Syncopate', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "0.08em", color: "#FFF" }}>
          ALZHEIMER'S<span style={{ color: "#F59E0B" }}>.AI</span>
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      <nav style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
        {[
          { id: "about", label: "About" },
          { id: "challenge", label: "Challenge" },
          { id: "approach", label: "Approach" },
          { id: "prototype", label: "Analysis Demo" },
          { id: "intelligence", label: "AI Pipeline" },
          { id: "data", label: "Dataset" },
          { id: "performance", label: "Metrics" },
          { id: "quantum", label: "Quantum ML" },
          { id: "timeline", label: "Timeline" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            style={{
              background: "none",
              border: "none",
              color: activeSection === item.id ? "#F59E0B" : "#94A3B8",
              fontWeight: activeSection === item.id ? 700 : 500,
              cursor: "pointer",
              transition: "color 0.3s ease",
              padding: "4px 8px",
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* RIGHT QUICK STATUS & DEMO CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {user ? (
          <div
            onClick={onOpenAuth}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              color: "#F59E0B",
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#10B981" }} />
            <span>{user.name}</span>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              backgroundColor: "rgba(14, 16, 23, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#FFF",
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Sign In / Register
          </button>
        )}

        <button
          onClick={() => scrollTo("prototype")}
          className="btn-amber-glow"
          style={{ padding: "8px 18px", fontSize: 13, fontFamily: "'Urbanist', sans-serif" }}
        >
          <span>Run Demo</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </header>
  );
}
