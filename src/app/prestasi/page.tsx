import Achievements from '@/components/Sections/Achievements';
import Testimonials from '@/components/Sections/Testimonials';

export default function PrestasiPage() {
  return (
    <main className="pt-20 lg:pt-32 min-h-screen selection:bg-ltec-cyan/30 selection:text-white overflow-hidden">
      <Achievements />
      <Testimonials />
    </main>
  );
}
