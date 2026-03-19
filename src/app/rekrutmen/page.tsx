import Recruitment from '@/components/Sections/Recruitment';
import DivisionRecruitment from '@/components/Sections/DivisionRecruitment';
import Journey from '@/components/Sections/Journey';
import { getRecruitmentStatus } from '@/app/actions/admin';

export default async function RekrutmenPage() {
  const isOpen = await getRecruitmentStatus();
  return (
    <main className="pt-20 lg:pt-32 min-h-screen selection:bg-ltec-cyan/30 selection:text-white overflow-hidden">
      <Recruitment isOpen={isOpen} />
      <DivisionRecruitment isOpen={isOpen} />
      <Journey />
    </main>
  );
}
