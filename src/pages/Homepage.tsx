import { useRef, useState } from "react";

import CTA from "../components/landingpage/CTA";
import Features from "../components/landingpage/Features";
import Footer from "../components/landingpage/Footer";
import Header from "../components/landingpage/Header";
import HeroSection from "../components/landingpage/HeroSection";
import HowItWorks from "../components/landingpage/HowItWorks";
import ProblemSolution from "../components/landingpage/ProblemSolution";
import UseCases from "../components/landingpage/UseCases";
import SuccessfullLogoutToast from "../components/toast/SuccessfullLogoutToast";
import "../styles/landing.css";

const Homepage = () => {
  const params = new URLSearchParams(location.search);
  const successfulLogout = params.get("logout") === "success";
  const [showLogoutAlert, setShowLogoutAlert] = useState(true);

  const pageScrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      {successfulLogout && showLogoutAlert && (
        <SuccessfullLogoutToast
          showLogoutAlert={showLogoutAlert}
          setShowLogoutAlert={setShowLogoutAlert}
        />
      )}
      <div ref={pageScrollRef} className="lp-root">
        {/* HERO */}
        <section className="lp-hero">
          <Header />

          <div className="lp-container hero-inner">
            <HeroSection />
          </div>
        </section>

        <section className="lp-section problem">
          <div className="lp-container">
            <ProblemSolution />
          </div>
        </section>

        <section className="lp-section how">
          <div className="lp-container">
            <HowItWorks />
          </div>
        </section>

        <Features scrollParentRef={pageScrollRef} />

        <UseCases scrollParentRef={pageScrollRef} />

        <section className="lp-section cta">
          <div className="lp-container">
            <CTA />
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Homepage;
