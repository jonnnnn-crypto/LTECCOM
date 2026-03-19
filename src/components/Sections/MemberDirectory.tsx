'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, GraduationCap, Code, Globe, PenTool, Database } from 'lucide-react';

export default function MemberDirectory({ members, divisions }: { members: any[], divisions: any[] }) {
  const [activeDiv, setActiveDiv] = useState(divisions[0]?.name || '');
  const [search, setSearch] = useState('');

  // Group by batch_year
  const groupedMembers = useMemo(() => {
    let filtered = members.filter(m => m.division === activeDiv);
    if (search) {
      filtered = filtered.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
    }
    
    const groups: Record<string, any[]> = {};
    filtered.forEach(m => {
      if (!groups[m.batch_year]) groups[m.batch_year] = [];
      groups[m.batch_year].push(m);
    });
    
    // Sort batches descending
    const sortedBatches = Object.keys(groups).sort((a,b) => parseInt(b) - parseInt(a));
    return { groups, sortedBatches };
  }, [members, activeDiv, search]);

  const ICONS: any = {
    'Software Development': Code,
    'Software': Code,
    'Website': Globe,
    'Multimedia': PenTool,
    'Networking': Database
  };

  return (
    <section className="py-32 bg-[#050505] min-h-screen relative z-10 border-t border-white/5">
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
             <Users size={16} /> Data Registri
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl md:text-5xl font-serif text-white mb-6">
            Anggota & Alumni
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-gray-400 text-lg">
            Direktori talenta digital Liwa Tech Excellent Community dari berbagai lintas angkatan.
          </motion.p>
        </div>

        {/* Division Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {divisions.map((div, i) => {
            const Icon = ICONS[div.name] || Users;
            return (
              <motion.button 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * i }}
                key={div.id}
                onClick={() => setActiveDiv(div.name)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                  activeDiv === div.name 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]' 
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 text-white'
                }`}
              >
                <Icon size={18} />
                {div.name}
              </motion.button>
            )
          })}
        </div>
        
        {/* Search */}
        <div className="max-w-md mx-auto mb-16 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Cari nama anggota..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-gray-600 outline-none transition-all"
          />
        </div>

        {/* Results */}
        <div className="space-y-20">
          <AnimatePresence mode="wait">
            {groupedMembers.sortedBatches.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-gray-500 py-20 border border-white/5 rounded-3xl border-dashed">
                Tidak ada anggota ditemukan berdasarkan pencarian Anda.
              </motion.div>
            ) : (
              groupedMembers.sortedBatches.map((batchYear, bIdx) => (
                <motion.div key={batchYear} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: bIdx * 0.1 }}>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex flex-shrink-0 items-center justify-center border border-cyan-500/20 text-cyan-400">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif text-white">Angkatan {batchYear}</h3>
                      <p className="text-sm text-gray-500">{groupedMembers.groups[batchYear].length} Anggota</p>
                    </div>
                    <div className="flex-1 w-full md:w-auto h-px bg-gradient-to-r from-cyan-500/20 to-transparent md:ml-4 mt-2 md:mt-0" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groupedMembers.groups[batchYear].sort((a,b) => {
                      if (a.role.includes('Ketua') && !b.role.includes('Ketua')) return -1;
                      if (!a.role.includes('Ketua') && b.role.includes('Ketua')) return 1;
                      return 0;
                    }).map((member: any, mIdx: number) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: (bIdx * 0.1) + (mIdx * 0.05) }}
                        key={member.id} 
                        className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center hover:border-cyan-500/30 transition-colors group relative overflow-hidden bg-white/5"
                      >
                         {member.role.includes('Ketua') && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />}
                         <div className="w-24 h-24 rounded-full bg-black/50 border border-white/10 mb-5 overflow-hidden group-hover:scale-105 transition-transform">
                            {member.photo_url ? (
                               <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                               <div className="w-full h-full flex items-center justify-center text-gray-500"><Users size={32} /></div>
                            )}
                         </div>
                         <h4 className="text-white font-medium text-lg text-center mb-1">{member.name}</h4>
                         <span className={`text-xs text-center border px-3 py-1 rounded-full ${
                           member.role.includes('Ketua') ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-400'
                         }`}>{member.role}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
