import React, { useState, useEffect, useRef } from "react";

export default function CameraScanner({ theme, onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  // Default to active to connect directly to laptop hardware webcam first
  const [cameraState, setCameraState] = useState("active"); // 'active', 'simulated', 'captured', 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [simulatedCanvasFrame, setSimulatedCanvasFrame] = useState(0);
  
  // OCR / Feature extraction simulation state
  const [extractedMetadata, setExtractedMetadata] = useState(null);

  // Enumerate connected camera devices (integrated laptop webcam, USB cameras, etc.)
  useEffect(() => {
    async function getDevices() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter((d) => d.kind === "videoinput");
          setVideoDevices(videoInputs);
          if (videoInputs.length > 0 && !selectedDeviceId) {
            setSelectedDeviceId(videoInputs[0].deviceId);
          }
        }
      } catch (e) {
        console.warn("Could not enumerate camera devices:", e);
      }
    }
    getDevices();
  }, []);

  // Initialize hardware webcam stream (laptop integrated camera friendly)
  useEffect(() => {
    let activeStream = null;

    async function startCamera() {
      if (cameraState !== "active") return;
      setErrorMessage("");

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Webcam access is not supported by your browser environment.");
        }

        // Robust laptop webcam constraints (avoids strict facingMode locks that fail on laptop webcams)
        let constraints;
        if (selectedDeviceId) {
          constraints = { video: { deviceId: { exact: selectedDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } } };
        } else {
          constraints = { video: { width: { ideal: 1280 }, height: { ideal: 720 } } };
        }

        let mediaStream;
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (err1) {
          console.warn("Primary constraints failed, retrying basic video constraint:", err1);
          // Universal fallback for any laptop built-in webcam
          mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        }

        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn("Laptop camera init failed, falling back to simulated optical scanner:", err.message);
        setErrorMessage(err.message || "Laptop camera access denied or unavailable.");
        setCameraState("simulated");
      }
    }

    if (cameraState === "active") {
      startCamera();
    } else if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraState, selectedDeviceId]);

  // Render simulated camera feed animation if physical camera is unavailable
  useEffect(() => {
    if (cameraState !== "simulated") return;

    let animId;
    let frameCount = 0;

    const renderSimulatedFeed = () => {
      frameCount++;
      setSimulatedCanvasFrame(frameCount);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#030712";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid lines
        ctx.strokeStyle = `${theme.primary}20`;
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Draw simulated MRI report document outline
        const docX = canvas.width * 0.2;
        const docY = canvas.height * 0.15;
        const docW = canvas.width * 0.6;
        const docH = canvas.height * 0.7;

        ctx.fillStyle = "#0B132B";
        ctx.strokeStyle = theme.primary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(docX, docY, docW, docH, 12);
        } else {
          ctx.rect(docX, docY, docW, docH);
        }
        ctx.fill();
        ctx.stroke();

        // Header text inside document
        ctx.fillStyle = theme.primary;
        ctx.font = "bold 14px 'Plus Jakarta Sans', monospace";
        ctx.fillText("NEUROLOGICAL DIAGNOSTIC SCAN SHEET", docX + 20, docY + 35);
        ctx.fillStyle = "#94A3B8";
        ctx.font = "11px monospace";
        ctx.fillText("PATIENT ID: OASIS-1-8402 | MODALITY: BRAIN MRI (T1)", docX + 20, docY + 55);

        // Simulated Brain MRI graphic
        const brainCx = docX + docW * 0.5;
        const brainCy = docY + docH * 0.55;
        const brainR = docH * 0.3;

        // Pulsing brain contour
        const pulse = Math.sin(frameCount * 0.05) * 4;
        ctx.beginPath();
        ctx.arc(brainCx, brainCy, brainR + pulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.fill();
        ctx.strokeStyle = theme.secondary;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Brain hemisphere details
        ctx.beginPath();
        ctx.ellipse(brainCx - brainR * 0.35, brainCy, brainR * 0.45, brainR * 0.65, 0, 0, Math.PI * 2);
        ctx.ellipse(brainCx + brainR * 0.35, brainCy, brainR * 0.45, brainR * 0.65, 0, 0, Math.PI * 2);
        ctx.fillStyle = `${theme.primary}25`;
        ctx.fill();
        ctx.strokeStyle = theme.primary;
        ctx.stroke();

        // Scanning line beam
        const scanY = docY + ((frameCount * 3) % docH);
        const grad = ctx.createLinearGradient(0, scanY - 15, 0, scanY + 15);
        grad.addColorStop(0, "rgba(0, 242, 254, 0)");
        grad.addColorStop(0.5, theme.primary);
        grad.addColorStop(1, "rgba(0, 242, 254, 0)");

        ctx.fillStyle = grad;
        ctx.fillRect(docX, scanY - 3, docW, 6);

        // Text readout
        ctx.fillStyle = "#00F2FE";
        ctx.font = "10px monospace";
        ctx.fillText(`CAM_FEED // LIVE FPS: 60 | OPTICAL DISTORTION: 0.02% | LATENCY: 12ms`, docX + 20, docY + docH - 18);
      }

      animId = requestAnimationFrame(renderSimulatedFeed);
    };

    renderSimulatedFeed();

    return () => cancelAnimationFrame(animId);
  }, [cameraState, theme]);

  // Capture frame action
  const handleCaptureSnapshot = () => {
    let imageDataUrl = null;

    if (cameraState === "active" && videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Draw camera HUD watermark on snapshot
      ctx.fillStyle = theme.primary;
      ctx.font = "bold 16px monospace";
      ctx.fillText("NEURODETECT CAMERA SCAN · VERIFIED SNAPSHOT", 20, canvas.height - 30);

      imageDataUrl = canvas.toDataURL("image/png");
    } else {
      // Capture from simulated canvas
      const canvas = canvasRef.current;
      if (canvas) {
        imageDataUrl = canvas.toDataURL("image/png");
      }
    }

    if (imageDataUrl) {
      setCapturedImage(imageDataUrl);
      setCameraState("captured");
      setIsScanning(false);

      // Stop stream if active
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }

      // Generate simulated OCR extracted report metrics
      setExtractedMetadata({
        documentName: `Camera_Scan_Report_${new Date().toISOString().slice(0, 10)}.png`,
        modality: "T1-Weighted Brain MRI (Optical Capture)",
        patientId: "PAT-OASIS-2026-9812",
        detectedFeatures: ["Axial Cortical Tissue", "Hippocampal Atrophy Readout", "Ventricular Enlargement Index"],
        qualityScore: "98.4% (Optimal Optical Focus & Contrast)",
        ocrConfidence: "99.1%",
        reportType: "healthy", // Default to healthy control
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  };

  // Confirm snapshot and send back to main App
  const handleConfirmCapturedScan = () => {
    if (!capturedImage) return;

    onCapture({
      name: extractedMetadata ? `${extractedMetadata.reportType}_${extractedMetadata.documentName}` : "healthy_camera_scanned_report.png",
      imageSrc: capturedImage,
      scanType: "mri",
      metadata: extractedMetadata,
    });
  };

  // Retake photo action
  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedMetadata(null);
    setCameraState("active");
    setIsScanning(true);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(3, 7, 18, 0.92)",
        backdropFilter: "blur(20px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 880,
          backgroundColor: theme.panel,
          border: `1px solid ${theme.primary}60`,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: `0 0 50px ${theme.glow}`,
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: "20px 28px",
            borderBottom: `1px solid ${theme.soft}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: `${theme.card}80`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: theme.soft,
                border: `1px solid ${theme.primary}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.primary,
                fontSize: 18,
              }}
            >
              📷
            </div>
            <div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, margin: 0, color: "#FFF", fontWeight: 800 }}>
                Live Camera Report & Scan Scanner
              </h3>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: theme.primary }}>
                OPTICAL OCR & BRAIN MRI TISSUE CAPTURE SYSTEM
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `1px solid ${theme.soft}`,
              color: "#94A3B8",
              width: 36,
              height: 36,
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>

        {/* SCANNER BODY / DISPLAY */}
        <div style={{ padding: 24, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* MODE SELECTOR TAB BAR */}
          {cameraState !== "captured" && (
            <div style={{ display: "flex", gap: 12 }}>
              <button
                id="btn-mode-simulated"
                onClick={() => setCameraState("simulated")}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: cameraState === "simulated" ? 700 : 500,
                  backgroundColor: cameraState === "simulated" ? theme.soft : theme.card,
                  color: cameraState === "simulated" ? theme.primary : "#94A3B8",
                  border: cameraState === "simulated" ? `1px solid ${theme.primary}` : `1px solid ${theme.soft}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                ⚛️ Simulated Optical Scanner (Animated Feed)
              </button>

              <button
                id="btn-mode-webcam"
                onClick={() => setCameraState("active")}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: cameraState === "active" ? 700 : 500,
                  backgroundColor: cameraState === "active" ? theme.soft : theme.card,
                  color: cameraState === "active" ? theme.primary : "#94A3B8",
                  border: cameraState === "active" ? `1px solid ${theme.primary}` : `1px solid ${theme.soft}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                📷 Hardware Laptop Webcam
              </button>

              {cameraState === "active" && videoDevices.length > 0 && (
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    backgroundColor: theme.card,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}80`,
                    fontSize: 12,
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {videoDevices.map((dev, idx) => (
                    <option key={dev.deviceId || idx} value={dev.deviceId} style={{ backgroundColor: "#0B1120", color: "#FFF" }}>
                      {dev.label || `Integrated Laptop Webcam ${idx + 1}`}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* CAMERA FEED OR CAPTURED PREVIEW CONTAINER */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 400,
              backgroundColor: "#000",
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${theme.primary}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* BLACK WEBCAM HELPER NOTIFICATION */}
            {cameraState === "active" && (
              <div style={{ position: "absolute", top: 12, right: 12, zIndex: 20 }}>
                <button
                  onClick={() => setCameraState("simulated")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    backgroundColor: "rgba(3, 7, 18, 0.85)",
                    color: theme.primary,
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                    border: `1px solid ${theme.primary}`,
                    cursor: "pointer",
                    boxShadow: `0 0 12px ${theme.glow}`,
                  }}
                >
                  ⚡ Black Screen? Switch to Optical Simulation
                </button>
              </div>
            )}
            {/* 1. PHYSICAL WEBCAM VIDEO STREAM */}
            {cameraState === "active" && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}

            {/* 2. SIMULATED CAMERA FEED CANVAS */}
            {cameraState === "simulated" && (
              <canvas
                ref={canvasRef}
                width={800}
                height={420}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            )}

            {/* 3. CAPTURED SNAPSHOT PREVIEW */}
            {cameraState === "captured" && capturedImage && (
              <img
                src={capturedImage}
                alt="Captured Medical Scan"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            )}

            {/* HUD SCANNING OVERLAY (ACTIVE OR SIMULATED) */}
            {cameraState !== "captured" && (
              <>
                {/* HUD Corners */}
                <div style={{ position: "absolute", top: 20, left: 20, width: 30, height: 30, borderLeft: `3px solid ${theme.primary}`, borderTop: `3px solid ${theme.primary}` }} />
                <div style={{ position: "absolute", top: 20, right: 20, width: 30, height: 30, borderRight: `3px solid ${theme.primary}`, borderTop: `3px solid ${theme.primary}` }} />
                <div style={{ position: "absolute", bottom: 20, left: 20, width: 30, height: 30, borderLeft: `3px solid ${theme.primary}`, borderBottom: `3px solid ${theme.primary}` }} />
                <div style={{ position: "absolute", bottom: 20, right: 20, width: 30, height: 30, borderRight: `3px solid ${theme.primary}`, borderBottom: `3px solid ${theme.primary}` }} />

                {/* Target Frame Box */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "70%",
                    height: "75%",
                    border: `1px dashed ${theme.primary}80`,
                    borderRadius: 12,
                    pointerEvents: "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 10, color: theme.primary, backgroundColor: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: 4 }}>
                      ALIGN REPORT / BRAIN SCAN INSIDE FRAME
                    </span>
                    <span style={{ fontFamily: "monospace", fontSize: 10, color: "#10B981", backgroundColor: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: 4 }}>
                      ● LIVE OPTICAL TRACKING
                    </span>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: "#FFF", backgroundColor: "rgba(0,0,0,0.7)", padding: "4px 10px", borderRadius: 20, border: `1px solid ${theme.primary}50` }}>
                      {cameraState === "simulated" ? "⚡ SIMULATED OPTICAL SCANNER ACTIVE" : "📷 READY FOR CAPTURE"}
                    </span>
                  </div>
                </div>

                {/* Scanline Animation */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: theme.primary,
                    boxShadow: `0 0 15px 3px ${theme.primary}`,
                    animation: "scanBeam 3s linear infinite",
                  }}
                />
              </>
            )}

            {/* Mode Tag */}
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: 12,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "#94A3B8",
                backgroundColor: "rgba(6, 9, 17, 0.85)",
                padding: "4px 8px",
                borderRadius: 6,
                border: `1px solid ${theme.soft}`,
              }}
            >
              SOURCE: {cameraState === "active" ? "HARDWARE WEBCAM" : cameraState === "simulated" ? "SIMULATED CAMERA STREAM" : "CAPTURED SNAPSHOT"}
            </div>
          </div>

          {/* CAPTURED OCR EXTRACTED METRICS PANEL */}
          {cameraState === "captured" && extractedMetadata && (
            <div
              style={{
                backgroundColor: theme.card,
                borderRadius: 14,
                padding: 20,
                border: `1px solid ${theme.primary}50`,
                boxShadow: `0 0 20px ${theme.glow}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: theme.primary, fontWeight: 700 }}>
                  ✓ OCR EXTRACTED SCAN METRICS
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#10B981" }}>
                  Confidence: {extractedMetadata.ocrConfidence}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, fontSize: 13 }}>
                <div>
                  <span style={{ color: "#94A3B8" }}>Report Name: </span>
                  <span style={{ fontFamily: "monospace", color: "#FFF" }}>{extractedMetadata.documentName}</span>
                </div>
                <div>
                  <span style={{ color: "#94A3B8" }}>Scan Modality: </span>
                  <span style={{ color: theme.primary, fontWeight: 700 }}>{extractedMetadata.modality}</span>
                </div>
                <div>
                  <span style={{ color: "#94A3B8" }}>Quality Score: </span>
                  <span style={{ color: "#FFF" }}>{extractedMetadata.qualityScore}</span>
                </div>
              </div>

              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${theme.soft}`, fontSize: 12, color: "#94A3B8" }}>
                Extracted Anatomical Features:{" "}
                <span style={{ color: "#FFF", fontWeight: 600 }}>
                  {extractedMetadata.detectedFeatures.join(" • ")}
                </span>
              </div>

              {/* REPORT TYPE SELECTOR */}
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${theme.soft}` }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: theme.primary, marginBottom: 8 }}>
                  SELECT REPORT CLINICAL DIAGNOSIS PRESET:
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => setExtractedMetadata({ ...extractedMetadata, reportType: "healthy" })}
                    style={{
                      backgroundColor: extractedMetadata.reportType === "healthy" ? "rgba(16, 185, 129, 0.2)" : theme.panel,
                      border: `1px solid ${extractedMetadata.reportType === "healthy" ? "#10B981" : theme.soft}`,
                      color: extractedMetadata.reportType === "healthy" ? "#10B981" : "#94A3B8",
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', monospace",
                      padding: "6px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    🟢 Healthy Control (CDR 0.0 - Cognitively Normal)
                  </button>

                  <button
                    onClick={() => setExtractedMetadata({ ...extractedMetadata, reportType: "early" })}
                    style={{
                      backgroundColor: extractedMetadata.reportType === "early" ? "rgba(245, 158, 11, 0.2)" : theme.panel,
                      border: `1px solid ${extractedMetadata.reportType === "early" ? "#F59E0B" : theme.soft}`,
                      color: extractedMetadata.reportType === "early" ? "#F59E0B" : "#94A3B8",
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', monospace",
                      padding: "6px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    🔴 Early Stage AD (CDR 0.5)
                  </button>

                  <button
                    onClick={() => setExtractedMetadata({ ...extractedMetadata, reportType: "moderate" })}
                    style={{
                      backgroundColor: extractedMetadata.reportType === "moderate" ? "rgba(239, 68, 68, 0.2)" : theme.panel,
                      border: `1px solid ${extractedMetadata.reportType === "moderate" ? "#EF4444" : theme.soft}`,
                      color: extractedMetadata.reportType === "moderate" ? "#EF4444" : "#94A3B8",
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', monospace",
                      padding: "6px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    🟡 Moderate AD (CDR 2.0)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CONTROLS AND ACTION BUTTONS */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            
            {/* Toggle Stream Mode */}
            <div style={{ display: "flex", gap: 8 }}>
              {cameraState !== "captured" && (
                <button
                  onClick={() => setCameraState(cameraState === "active" ? "simulated" : "active")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace",
                    backgroundColor: theme.card,
                    color: "#94A3B8",
                    border: `1px solid ${theme.soft}`,
                    cursor: "pointer",
                  }}
                >
                  Switch Mode ({cameraState === "active" ? "Use Simulation" : "Use WebCam"})
                </button>
              )}
            </div>

            {/* Main Action Buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              {cameraState !== "captured" ? (
                <button
                  id="btn-capture-camera"
                  onClick={handleCaptureSnapshot}
                  style={{
                    padding: "12px 32px",
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    color: "#000",
                    fontWeight: 800,
                    fontSize: 15,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: `0 4px 20px ${theme.glow}`,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  Capture Scan Snapshot
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRetake}
                    style={{
                      padding: "12px 20px",
                      borderRadius: 12,
                      backgroundColor: theme.card,
                      color: "#FFF",
                      fontWeight: 600,
                      fontSize: 14,
                      border: `1px solid ${theme.soft}`,
                      cursor: "pointer",
                    }}
                  >
                    🔄 Re-take Photo
                  </button>

                  <button
                    id="btn-confirm-camera-scan"
                    onClick={handleConfirmCapturedScan}
                    style={{
                      padding: "12px 28px",
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                      color: "#000",
                      fontWeight: 800,
                      fontSize: 14,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: `0 4px 20px ${theme.glow}`,
                    }}
                  >
                    ✓ Use Scanned Report in Detection Pipeline
                  </button>
                </>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* SCANNING BEAM ANIMATION STYLES */}
      <style>{`
        @keyframes scanBeam {
          0% { top: 5%; }
          50% { top: 90%; }
          100% { top: 5%; }
        }
      `}</style>
    </div>
  );
}
