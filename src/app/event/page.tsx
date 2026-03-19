;
;
import { getWebinarEvents } from '@/app/actions/cms';
import { Calendar, MonitorPlay, Trophy, Link as LinkIcon, Users } from 'lucide-react';

export default async function EventPage() {
  const events = await getWebinarEvents();

  return (
    <main className="min-h-screen bg-[#050505] selection:bg-ltec-cyan/30 selection:text-white relative overflow-hidden">
      

      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ltec-cyan/5 blur-[120px] pointer-events-none rounded-full" />

      <section className="pt-40 lg:pt-48 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-emerald-400 text-sm font-bold tracking-widest uppercase mb-4 block">Agenda & Kegiatan</span>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Jadwal <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-ltec-cyan">Event</span> Terbaru</h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Daftar kegiatan, kompetisi CTF, kunjungan kampus, dan webinar teknologi terbuka yang diselenggarakan oleh keluarga besar LTEC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {events.map((event) => (
               <div key={event.id} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-emerald-500/30 transition-colors group relative overflow-hidden flex flex-col h-full bg-black/40 backdrop-blur-xl">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-ltec-cyan blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity" />
                 
                 {event.image_url && (
                   <div className="w-full h-48 rounded-xl overflow-hidden mb-6 border border-white/5 relative">
                     <div className="absolute inset-0 bg-emerald-500/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   </div>
                 )}

                 <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
                      {event.type.toLowerCase().includes('webinar') ? <MonitorPlay size={14} className="text-emerald-400"/> : event.type.toLowerCase().includes('lomba') ? <Trophy size={14} className="text-yellow-400"/> : <Users size={14} className="text-ltec-cyan"/>}
                      {event.type}
                    </div>
                    <div className="text-sm font-medium text-gray-400 flex items-center gap-1.5">
                      <Calendar size={14} /> {event.event_date}
                    </div>
                 </div>

                 <h3 className="text-2xl font-serif text-white mb-3 leading-tight">{event.title}</h3>
                 <p className="text-gray-400 leading-relaxed mb-8 flex-1">
                   {event.description}
                 </p>

                 <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                   <div className="text-xs text-gray-500">
                     Penyelenggara: <span className="text-ltec-cyan font-medium">{event.created_by}</span>
                   </div>
                   {event.link && (
                     <a href={event.link} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-colors border border-transparent hover:border-emerald-500/30">
                       <LinkIcon size={18} />
                     </a>
                   )}
                 </div>
               </div>
             ))}

             {events.length === 0 && (
               <div className="col-span-full py-20 text-center glass-panel rounded-3xl border border-white/10 border-dashed">
                 <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center text-gray-400">
                   <MonitorPlay size={24} />
                 </div>
                 <h3 className="text-xl font-medium text-white mb-2">Belum Ada Agenda</h3>
                 <p className="text-gray-500">Jadwal webinar dan lomba saat ini sedang kosong. Panitia akan segera memperbaruinya.</p>
               </div>
             )}
          </div>
        </div>
      </section>

      
    </main>
  );
}
