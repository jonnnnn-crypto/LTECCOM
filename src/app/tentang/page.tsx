import About from '@/components/Sections/About';
import VisionMission from '@/components/Sections/VisionMission';
import Journey from '@/components/Sections/Journey';
import Testimonials from '@/components/Sections/Testimonials';

export default function TentangPage() {
  return (
    <main className="pt-20 lg:pt-32 min-h-screen selection:bg-ltec-cyan/30 selection:text-white overflow-hidden">
      <About />
      <VisionMission />
      <Journey />
      <Testimonials />
    </main>
  );
}
