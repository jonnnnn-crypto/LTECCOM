import Hero from '@/components/Sections/Hero';
import FeaturedMoments from '@/components/Sections/FeaturedMoments';
import Testimonials from '@/components/Sections/Testimonials';

export default function Home() {
  return (
    <main className="selection:bg-ltec-cyan/30 selection:text-white overflow-hidden">
      <Hero />
      <FeaturedMoments />
      <Testimonials />
    </main>
  );
}
