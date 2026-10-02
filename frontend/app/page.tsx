import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustBar from "@/components/landing/TrustBar";
import Problem from "@/components/landing/Problem";
import Features from "@/components/landing/Features";
import Pipeline from "@/components/landing/Pipeline";
import BeforeAfter from "@/components/landing/BeforeAfter";
import CloudinarySection from "@/components/landing/CloudinarySection";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <TrustBar />
        <Problem />
        <Features />
        <Pipeline />
        <BeforeAfter />
        <CloudinarySection />
        <CTA />
      </main>

      <Footer />
    </>
  );
}