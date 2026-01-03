import {
  Navbar,
  HeroSection,
  ProgramsSection,
  RoadmapSection,
  TestimonialsSection,
  CTASection,
  ContactSection,
  Footer,
} from '@/features/landing';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-light-50">
      <Navbar />
      <HeroSection />
      <ProgramsSection />
      <RoadmapSection />
      <TestimonialsSection />
      <CTASection />
      <ContactSection />
      <Footer />
    </div>
  );
}
