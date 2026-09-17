import React, { useState } from "react";
import CustomCursor from "./components/CustomCursor.jsx";
import HeaderNav from "./components/HeaderNav.jsx";
import AuthModal from "./components/AuthModal.jsx";
import HeroSection from "./components/HeroSection.jsx";
import AboutSection from "./components/AboutSection.jsx";
import ChallengeSection from "./components/ChallengeSection.jsx";
import ApproachSection from "./components/ApproachSection.jsx";
import InteractiveScannerSection from "./components/InteractiveScannerSection.jsx";
import ModelArchitectureSection from "./components/ModelArchitectureSection.jsx";
import DatasetSection from "./components/DatasetSection.jsx";
import PerformanceSection from "./components/PerformanceSection.jsx";
import ClassificationResultsSection from "./components/ClassificationResultsSection.jsx";
import QuantumSection from "./components/QuantumSection.jsx";
import ModelComparisonSection from "./components/ModelComparisonSection.jsx";
import TimelineSection from "./components/TimelineSection.jsx";
import TechStackSection from "./components/TechStackSection.jsx";
import GallerySection from "./components/GallerySection.jsx";
import FutureWorkSection from "./components/FutureWorkSection.jsx";
import DisclaimerBanner from "./components/DisclaimerBanner.jsx";
import FinalCTA from "./components/FinalCTA.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div style={{ backgroundColor: "#07080B", color: "#F1F5F9", position: "relative", overflowX: "hidden" }}>
      {/* Custom Interactive Ring Cursor */}
      <CustomCursor />

      {/* Floating Glassmorphism Navigation */}
      <HeaderNav user={user} onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Researcher Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => setUser(userData)}
      />

      {/* Main Continuous 18-Section Interactive Experience */}
      <main>
        {/* 1. HERO SECTION */}
        <HeroSection />

        {/* 2. INTRODUCTION / ABOUT THE PROJECT */}
        <AboutSection />

        {/* 3. THE PROBLEM / CHALLENGE */}
        <ChallengeSection />

        {/* 4. OUR APPROACH (5-STAGE PROCESS) */}
        <ApproachSection />

        {/* 5. MEDICAL IMAGE ANALYSIS (INTERACTIVE PROTOTYPE DEMO) */}
        <InteractiveScannerSection />

        {/* 6. MODEL / AI ARCHITECTURE */}
        <ModelArchitectureSection />

        {/* 7. DATASET SPECIFICATION */}
        <DatasetSection />

        {/* 8. MODEL PERFORMANCE METRICS */}
        <PerformanceSection />

        {/* 9. CLASSIFICATION / CLINICAL STAGES */}
        <ClassificationResultsSection />

        {/* 10. AI + QUANTUM RESEARCH */}
        <QuantumSection />

        {/* 11. MODEL COMPARISON BENCHMARKS */}
        <ModelComparisonSection />

        {/* 12. INTERACTIVE RESEARCH TIMELINE */}
        <TimelineSection />

        {/* 13. TECHNOLOGY STACK */}
        <TechStackSection />

        {/* 14. PROJECT GALLERY */}
        <GallerySection />

        {/* 15. RESEARCH / FUTURE WORK */}
        <FutureWorkSection />

        {/* 16. MEDICAL & RESEARCH DISCLAIMER */}
        <DisclaimerBanner />

        {/* 17. FINAL CALL TO ACTION */}
        <FinalCTA />
      </main>

      {/* 18. MINIMAL EDITORIAL FOOTER */}
      <Footer />
    </div>
  );
}
