;
;
import MemberDirectory from '@/components/Sections/MemberDirectory';
import { getDivisionMembers, getDivisionsInfo } from '@/app/actions/cms';

export default async function AnggotaPage() {
  const members = await getDivisionMembers();
  const divisions = await getDivisionsInfo();

  return (
    <main className="min-h-screen bg-[#050505] selection:bg-cyan-500/30 selection:text-white">
      
      <MemberDirectory members={members} divisions={divisions} />
      
    </main>
  );
}
