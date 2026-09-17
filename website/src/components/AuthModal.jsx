import React, { useState } from "react";
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    setTimeout(() => {
      setLoading(false);
      const userObj = {
        name: isSignUp ? (name || "Dr. Research Lead") : (email.split("@")[0] || "Researcher"),
        email: email || "researcher@neurodetect.ai",
        institution: institution || "Institute of Neurological AI",
      };
      setSuccessMsg(isSignUp ? "Account created successfully!" : "Authenticated successfully!");
      setTimeout(() => {
        onLoginSuccess(userObj);
        onClose();
      }, 900);
    }, 1000);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(3, 4, 6, 0.85)",
        backdropFilter: "blur(12px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: 480,
          padding: 36,
          position: "relative",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 158, 11, 0.15)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "none",
            border: "none",
            color: "#94A3B8",
            cursor: "pointer",
            padding: 6,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={20} />
        </button>

        {/* MODAL HEADER */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F59E0B",
              marginBottom: 16,
            }}
          >
            <ShieldCheck size={24} />
          </div>

          <h3
            style={{
              fontFamily: "'Syncopate', sans-serif",
              fontSize: 22,
              fontWeight: 800,
              color: "#FFF",
              margin: "0 0 8px 0",
              letterSpacing: "-0.02em",
            }}
          >
            {isSignUp ? "RESEARCHER REGISTRATION" : "RESEARCH LAB ACCESS"}
          </h3>

          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0, fontFamily: "'Urbanist', sans-serif" }}>
            {isSignUp
              ? "Register your profile for early model benchmarks & dataset access."
              : "Sign in with your researcher credentials to access Alzheimer's AI tools."}
          </p>
        </div>

        {/* AUTH FORM */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {isSignUp && (
            <>
              <div>
                <label style={{ display: "block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#F59E0B", marginBottom: 6 }}>
                  FULL NAME
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} color="#64748B" style={{ position: "absolute", left: 14, top: 14 }} />
                  <input
                    type="text"
                    required
                    placeholder="Dr. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px 12px 40px",
                      borderRadius: 10,
                      backgroundColor: "#080A0F",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "#FFF",
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#F59E0B", marginBottom: 6 }}>
                  INSTITUTION / CLINIC
                </label>
                <input
                  type="text"
                  placeholder="Stanford Neurological Institute"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    backgroundColor: "#080A0F",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#FFF",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </>
          )}

          <div>
            <label style={{ display: "block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#F59E0B", marginBottom: 6 }}>
              RESEARCH EMAIL ADDRESS
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} color="#64748B" style={{ position: "absolute", left: 14, top: 14 }} />
              <input
                type="email"
                required
                placeholder="researcher@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 40px",
                  borderRadius: 10,
                  backgroundColor: "#080A0F",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#FFF",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#F59E0B", marginBottom: 6 }}>
              SECURITY PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} color="#64748B" style={{ position: "absolute", left: 14, top: 14 }} />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 40px",
                  borderRadius: 10,
                  backgroundColor: "#080A0F",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#FFF",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {successMsg && (
            <div style={{ padding: 12, borderRadius: 8, backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981", color: "#10B981", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-amber-glow"
            style={{
              padding: "14px",
              marginTop: 10,
              width: "100%",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            <span>{loading ? "Authenticating..." : isSignUp ? "Create Researcher Account" : "Access Alzheimer's AI Workspace"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* TOGGLE BETWEEEN SIGN IN & SIGN UP */}
        <div style={{ textAlign: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255, 255, 255, 0.08)", fontSize: 13, color: "#94A3B8" }}>
          {isSignUp ? "Already have an active account? " : "Need researcher portal access? "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: "none",
              border: "none",
              color: "#F59E0B",
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            {isSignUp ? "Sign In" : "Register Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
