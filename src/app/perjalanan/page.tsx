import Journey from '@/components/Sections/Journey';
import Testimonials from '@/components/Sections/Testimonials';
import FeaturedMoments from '@/components/Sections/FeaturedMoments';

export default function PerjalananPage() {
  return (
    <main className="pt-20 lg:pt-32 min-h-screen selection:bg-ltec-cyan/30 selection:text-white overflow-hidden">
      <Journey />
      <FeaturedMoments />
      <Testimonials />
    </main>
  );
}
