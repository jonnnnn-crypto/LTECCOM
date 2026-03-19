'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const ADVISORS = [
  { role: 'Pelindung', name: 'Tri Yunita, S.Ag.M.Pd.I', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
  { role: 'Penanggung Jawab', name: 'Latip Ihpa S.Kom', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop' },
  { role: 'Pembina', name: 'Ahmad Subhan S.Kom', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' }
];

export default function Structure({ profiles = [] }: { profiles?: any[] }) {

  const CORE_BOARD = useMemo(() => {
    const roles = ['Ketua Umum', 'Wakil Ketua Umum', 'Sekretaris Umum', 'Bendahara Umum'];
    return roles.map(r => {
      const p = profiles.find(x => x.role === r);
      return {
        role: r,
        name: p?.full_name || 'Menunggu Penugasan',
        img: p?.photo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
      };
    });
  }, [profiles]);

  const DIVISIONS = useMemo(() => {
    const divNames = ['Phoenix', 'SysAdmin', 'Software Dev', 'Network Cabling', 'Cloud Computing'];
    return divNames.map(dName => {
      const ketua = profiles.find(x => x.division === dName && x.role === 'Ketua Divisi');
      const wakil = profiles.find(x => x.division === dName && x.role === 'Wakil Ketua Divisi');
      
      const members = [];
      if (ketua) members.push({ role: 'Ketua Divisi', name: ketua.full_name, img: ketua.photo_url || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' });
      if (wakil) members.push({ role: 'Wakil Ketua Divisi', name: wakil.full_name, img: wakil.photo_url || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop' });
      
      return {
        name: dName,
        members
      };
    });
  }, [profiles]);
  return (
    <section id="structure" className="py-32 bg-[#050505] relative z-10 overflow-hidden border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-ltec-cyan/5 blur-[150px] mix-blend-screen pointer-events-none rounded-[100%]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="text-ltec-cyan text-sm font-semibold tracking-widest uppercase mb-4 block">
            Tim di Balik Visi
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-white">
            Struktur <span className="text-transparent bg-clip-text bg-gradient-to-r from-ltec-cyan to-ltec-blue">Organisasi</span>
          </h2>
        </div>

        {/* Advisors Level */}
        <div className="mb-24">
          <h3 className="text-center text-sm text-gray-500 font-medium mb-10 tracking-widest uppercase">Dewan Kehormatan</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {ADVISORS.map((advisor, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-panel p-8 rounded-[2.5rem] border border-white/10 text-center flex-1 min-w-[280px] max-w-[350px] hover:bg-white/5 transition-colors group"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-ltec-cyan/30 group-hover:border-ltec-cyan transition-colors">
                  <img src={advisor.img} alt={advisor.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                </div>
                <div className="text-ltec-cyan text-xs mb-3 font-semibold uppercase tracking-wider">{advisor.role}</div>
                <div className="text-white font-serif text-xl">{advisor.name}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Core Board Level */}
        <div className="mb-24 relative">
          <h3 className="text-center text-sm text-gray-500 font-medium mb-10 tracking-widest uppercase">Pengurus Inti</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_BOARD.map((board, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-panel p-8 rounded-[2rem] border border-white/10 text-center hover:bg-white/5 transition-colors group"
              >
                <div className="w-20 h-20 mx-auto rounded-full mb-6 border border-ltec-cyan/30 overflow-hidden relative">
                  <img src={board.img} alt={board.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                </div>
                <h4 className="text-white font-serif text-lg mb-2">{board.name}</h4>
                <div className="text-gray-400 text-xs tracking-widest uppercase">{board.role}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divisions Level */}
        <div>
          <h3 className="text-center text-sm text-gray-500 font-medium mb-10 tracking-widest uppercase">Pengurus Divisi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {DIVISIONS.map((div, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-panel p-6 md:p-8 rounded-[2rem] border border-white/10 flex flex-col h-full hover:border-ltec-cyan/30 transition-colors"
              >
                <div className="text-white font-serif text-lg mb-6 flex-grow">{div.name}</div>
                <div className="space-y-4">
                  {div.members.map((member, j) => (
                    <div key={j} className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10">
                        <img src={member.img} alt={member.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                      </div>
                      <div>
                        <div className="text-[10px] text-ltec-cyan/70 mb-1 uppercase tracking-wider">{member.role}</div>
                        <div className="text-sm font-medium text-gray-200">{member.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
