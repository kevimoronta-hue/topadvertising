import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroVideo } from '@/components/sections/HeroVideo';
import { Manifesto } from '@/components/sections/Manifesto';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ChanganCaseStudy } from '@/components/sections/ChanganCaseStudy';
import { TransformationStory } from '@/components/sections/TransformationStory';
import { ProjectGallery } from '@/components/sections/ProjectGallery';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { AppointmentWizard } from '@/components/appointment/AppointmentWizard';
import { TestimonialsMarquee } from '@/components/sections/TestimonialsMarquee';
import { SocialSection } from '@/components/sections/SocialSection';
import { FinalCTA } from '@/components/sections/FinalCTA';

export default function Home() {
  return (
    <>
      <a className="sr" href="#servicios">
        Saltar al contenido
      </a>
      <Header />
      <main>
        <HeroVideo />
        <Manifesto />
        <ServicesSection />
        <ChanganCaseStudy />
        <TransformationStory />
        <ProjectGallery />
        <ProcessSection />
        <AppointmentWizard />
        <TestimonialsMarquee />
        <SocialSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
