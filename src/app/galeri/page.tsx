import Events from '@/components/Sections/Events';
import Achievements from '@/components/Sections/Achievements';

export default function GaleriPage() {
  return (
    <main className="pt-20 lg:pt-32 min-h-screen selection:bg-ltec-cyan/30 selection:text-white overflow-hidden">
      <Events />
      <Achievements />
    </main>
  );
}
