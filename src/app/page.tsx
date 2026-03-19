;
;
import Hero from '@/components/Sections/Hero';
import Journey from '@/components/Sections/Journey';
import Achievements from '@/components/Sections/Achievements';
import Events from '@/components/Sections/Events';
import Testimonials from '@/components/Sections/Testimonials';
import { getGallery, getAchievements, getTestimonials } from '@/app/actions/cms';

export default async function Home() {
  const gallery = await getGallery();
  const achievements = await getAchievements();
  const testimonials = await getTestimonials();

  return (
    <main className="min-h-screen bg-[#050505] selection:bg-ltec-cyan/30 selection:text-white">
      
      <Hero />
      <Journey />
      <Achievements achievements={achievements} />
      <Events gallery={gallery} />
      <Testimonials testimonials={testimonials} />
      
    </main>
  );
}
