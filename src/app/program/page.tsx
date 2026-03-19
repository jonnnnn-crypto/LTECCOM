import Programs from '@/components/Sections/Programs';
import FeaturedMoments from '@/components/Sections/FeaturedMoments';
import Recruitment from '@/components/Sections/Recruitment';

export default function ProgramPage() {
  return (
    <main className="pt-20 lg:pt-32 min-h-screen selection:bg-ltec-cyan/30 selection:text-white overflow-hidden">
      <Programs />
      <FeaturedMoments />
      <Recruitment />
    </main>
  );
}
