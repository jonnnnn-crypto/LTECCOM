'use client';
import { motion } from 'framer-motion';

const STEPS = [
  {
    num: '01',
    title: 'Gabung Komunitas',
    desc: 'Menjadi bagian dari keluarga LTEC dan dapatkan akses penuh ke perpustakaan sumber daya, mentoring eksklusif, serta lingkungan teknologi kami.'
  },
  {
    num: '02',
    title: 'Pilih Divisi Peminatan',
    desc: 'Fokuskan potensi Anda pada spesialisasi yang kami sediakan: Cyber Security, SysAdmin, Software Dev, Cloud, atau Network Cabling.'
  },
  {
    num: '03',
    title: 'Pelatihan & Praktik Rutin',
    desc: 'Terlibat langsung dalam lab intensif, simulasi skenario dunia nyata, dan pengembangan keterampilan teknis yang ketat.'
  },
  {
    num: '04',
    title: 'Kompetisi & Sertifikasi',
    desc: 'Kesiapan absolut untuk bertanding di Lomba Kompetensi Siswa (LKS), turnamen CTF, atau memperoleh sertifikasi standar industri global.'
  }
];

export default function Journey() {
  return (
    <section id="perjalanan" className="py-32 bg-[#050505] relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-serif text-white text-center mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ltec-blue to-purple-500">Jejak Langkah</span> Anda di LTEC
        </h2>
        <p className="text-gray-400 text-lg md:text-xl text-center max-w-2xl mx-auto mb-24 font-light">
          Alur terstruktur dan terbukti untuk bertransformasi dari pelajar ambisius menjadi profesional teknologi yang diakui industri.
        </p>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Glowing Line */}
          <div className="absolute left-[27px] md:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-ltec-cyan via-ltec-blue to-transparent transform md:-translate-x-1/2 opacity-30 shadow-[0_0_15px_rgba(0,230,255,0.5)]" />

          <div className="flex flex-col gap-16 md:gap-24">
            {STEPS.map((step, index) => {
              const isEven = index % 2 !== 0; // for alternating sides
              return (
                <motion.div 
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col md:flex-row items-start md:items-center relative w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Indicator Dot */}
                  <div className="w-14 h-14 rounded-full bg-[#050505] border border-ltec-cyan flex items-center justify-center relative z-10 shrink-0 mb-6 md:mb-0 md:absolute md:left-1/2 md:-translate-x-1/2 shadow-[0_0_30px_rgba(0,230,255,0.2)]">
                    <span className="text-ltec-cyan font-serif font-bold">{step.num}</span>
                  </div>

                  {/* Content Container */}
                  <div className={`w-full pl-20 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-24 md:text-right' : 'md:pl-24'}`}>
                    <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 hover:border-ltec-cyan/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(15,98,254,0.1)] group">
                      <h3 className="text-2xl md:text-3xl font-serif text-white mb-4 tracking-wide group-hover:text-ltec-cyan transition-colors">{step.title}</h3>
                      <p className="text-gray-400 font-light leading-relaxed text-base md:text-lg">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
