import { lazy, useRef, useState } from "react";

import DeferredSection from "../components/landingpage/DeferredSection";
import Header from "../components/landingpage/Header";
import HeroSection from "../components/landingpage/HeroSection";
import ProblemSolution from "../components/landingpage/ProblemSolution";
import SuccessfullLogoutToast from "../components/toast/SuccessfullLogoutToast";
import "../styles/landing.css";

const CTA = lazy(() => import("../components/landingpage/CTA"));
const Features = lazy(() => import("../components/landingpage/Features"));
const Footer = lazy(() => import("../components/landingpage/Footer"));
const HowItWorks = lazy(
  () => import("../components/landingpage/HowItWorks"),
);
const UseCases = lazy(() => import("../components/landingpage/UseCases"));

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
            <DeferredSection minHeight="700px" rootRef={pageScrollRef}>
              <HowItWorks />
            </DeferredSection>
          </div>
        </section>

        <DeferredSection minHeight="400vh" rootRef={pageScrollRef}>
          <Features scrollParentRef={pageScrollRef} />
        </DeferredSection>

        <DeferredSection minHeight="400vh" rootRef={pageScrollRef}>
          <UseCases scrollParentRef={pageScrollRef} />
        </DeferredSection>

        <DeferredSection minHeight="100vh" rootRef={pageScrollRef}>
          <div className="cta-footer-screen">
            <section className="lp-section cta">
              <div className="lp-container">
                <CTA />
              </div>
            </section>

            <Footer />
          </div>
        </DeferredSection>
      </div>
    </>
  );
};

export default Homepage;
