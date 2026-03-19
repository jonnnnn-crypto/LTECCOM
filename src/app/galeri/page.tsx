;
;
import Events from '@/components/Sections/Events';
import { getGallery } from '@/app/actions/cms';

export default async function GaleriPage() {
  const gallery = await getGallery();

  return (
    <main className="min-h-screen bg-[#050505] selection:bg-ltec-cyan/30 selection:text-white">
      
      <Events gallery={gallery} />
      
    </main>
  );
}
