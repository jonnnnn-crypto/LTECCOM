import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Achievements from '@/components/Sections/Achievements';
import { getAchievements } from '@/app/actions/cms';

export default async function PrestasiPage() {
  const achievements = await getAchievements();

  return (
    <main className="min-h-screen bg-[#050505] selection:bg-ltec-cyan/30 selection:text-white">
      <Navbar />
      <Achievements achievements={achievements} />
      <Footer />
    </main>
  );
}
