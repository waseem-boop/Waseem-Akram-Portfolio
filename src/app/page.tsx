
import Hero from "@/components/sections/Hero";
import DotTransition from "@/components/sections/DotTransition";
import Statement from "@/components/sections/Statement";
import Portfolio from "@/components/sections/Portfolio";
import Services from "@/components/sections/Services";
import BrandVision from "@/components/sections/BrandVision";
import Process from "@/components/sections/Process";
import TechStack from "@/components/sections/TechStack";
import CallToAction from "@/components/sections/CallToAction";


export default function Home() {
  return (
    <>

      <main>
        <div className="home-hero-stage">
          <Hero />
        </div>
        <Statement />
        <DotTransition />
        <Portfolio />
        <Services />
        <BrandVision />
        <Process />
        <TechStack />
        <CallToAction />
      </main>

    </>
  );
}
