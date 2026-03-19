import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Structure from '@/components/Sections/Structure';
import DivisionRecruitment from '@/components/Sections/DivisionRecruitment';
import { getProfiles, getRecruitmentStatus } from '@/app/actions/admin';
import { getDivisionsInfo } from '@/app/actions/cms';

export default async function DivisiPage() {
  const profiles = await getProfiles();
  const isOpen = await getRecruitmentStatus();
  const divisions = await getDivisionsInfo();

  return (
    <main className="min-h-screen bg-[#050505] selection:bg-ltec-cyan/30 selection:text-white">
      <Navbar />
      <Structure profiles={profiles} />
      <DivisionRecruitment isOpen={isOpen} divisions={divisions} />
      <Footer />
    </main>
  );
}
