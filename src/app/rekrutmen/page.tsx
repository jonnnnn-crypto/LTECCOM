import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import DivisionRecruitment from '@/components/Sections/DivisionRecruitment';
import { getRecruitmentStatus } from '@/app/actions/admin';
import { getDivisionsInfo } from '@/app/actions/cms';
import { Info, Calendar, Users, Target } from 'lucide-react';

export default async function RekrutmenPage() {
  const isOpen = await getRecruitmentStatus();
  const divisions = await getDivisionsInfo();

  return (
    <main className="min-h-screen bg-[#050505] selection:bg-ltec-cyan/30 selection:text-white">
      <Navbar />
      {/* Main Recruitment Section */}
      <DivisionRecruitment isOpen={isOpen} divisions={divisions} />

      <Footer />
    </main>
  );
}
