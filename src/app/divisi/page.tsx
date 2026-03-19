import Structure from '@/components/Sections/Structure';
import DivisionRecruitment from '@/components/Sections/DivisionRecruitment';
import { getProfiles } from '@/app/actions/admin';

export default async function DivisiPage() {
  const profiles = await getProfiles();

  return (
    <main className="pt-20 lg:pt-32 min-h-screen selection:bg-ltec-cyan/30 selection:text-white overflow-hidden">
      <Structure profiles={profiles} />
      <DivisionRecruitment />
    </main>
  );
}
