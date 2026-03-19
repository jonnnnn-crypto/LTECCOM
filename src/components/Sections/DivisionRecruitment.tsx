'use client';
import { motion } from 'framer-motion';
import { Shield, Server, Code, Wifi, Cloud, ArrowRight, UserCircle2 } from 'lucide-react';

const DIVISIONS = [
  {
    id: 'cyber-security',
    name: 'Phoenix (Cyber Security)',
    icon: Shield,
    color: 'text-red-500',
    borderColor: 'border-red-500/30',
    bgHover: 'hover:bg-red-500/5',
    ketua: 'Riski Permana',
    wakil: 'Farel Sapero',
    desc: 'Pelajari seni peretasan etis, kriptografi, respons insiden, dan pertahanan jaringan. Dirancang untuk mencetak spesialis keamanan siber.',
    quota: 20
  },
  {
    id: 'itnsa',
    name: 'SysAdmin (ITNSA)',
    icon: Server,
    color: 'text-ltec-cyan',
    borderColor: 'border-ltec-cyan/30',
    bgHover: 'hover:bg-ltec-cyan/5',
    ketua: 'Ridho Fitrawan',
    wakil: 'Fadil Erlangga',
    desc: 'Kuasai administrasi server Linux/Windows, infrastruktur IT, dan otomatisasi deployment standar enterprise.',
    quota: 25
  },
  {
    id: 'software-dev',
    name: 'Coding & Software Dev',
    icon: Code,
    color: 'text-blue-500',
    borderColor: 'border-blue-500/30',
    bgHover: 'hover:bg-blue-500/5',
    ketua: 'Rico Iqbal Jeryan',
    wakil: 'Daniel Alvino Akbar',
    desc: 'Bangun aplikasi web & mobile futuristik. Kuasai algoritma, struktur data, dan ekosistem modern seperti React & Node.js.',
    quota: 30
  },
  {
    id: 'network-cabling',
    name: 'Information (Network Cabling)',
    icon: Wifi,
    color: 'text-emerald-500',
    borderColor: 'border-emerald-500/30',
    bgHover: 'hover:bg-emerald-500/5',
    ketua: 'Teguh Anton Susanto',
    wakil: null,
    desc: 'Infrastruktur fisik adalah urat nadi teknologi. Pelajari instalasi fiber optik, manajemen rak server, dan perancangan topologi.',
    quota: 15
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    icon: Cloud,
    color: 'text-purple-500',
    borderColor: 'border-purple-500/30',
    bgHover: 'hover:bg-purple-500/5',
    ketua: 'Rahil Hidayat',
    wakil: null,
    desc: 'Migrasikan dunia ke awan. Pelajari AWS, Google Cloud, komputasi terdistribusi, dan arsitektur serverless microservices.',
    quota: 20
  }
];

export default function DivisionRecruitment({ isOpen = false }: { isOpen?: boolean }) {
  return (
    <section className="py-24 bg-[#050505] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-ltec-cyan text-sm font-semibold tracking-widest uppercase mb-4 block">
            Jalur Pendaftaran
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Pilih Divisi <span className="text-transparent bg-clip-text bg-gradient-to-r from-ltec-cyan to-indigo-400">Peminatan Anda</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Setiap pendaftaran angkatan baru dipimpin langsung oleh Ketua dan Wakil masing-masing divisi. Pilih divisi yang paling relevan dengan minat Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 gap-6 max-w-6xl mx-auto">
          {DIVISIONS.map((div, idx) => {
            const Icon = div.icon;
            // The last item spans full width if odd number of elements to look symmetric
            const isLastOdd = idx === DIVISIONS.length - 1 && DIVISIONS.length % 2 !== 0;

            return (
              <motion.div
                key={div.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`glass-panel p-8 md:p-10 rounded-3xl border ${div.borderColor} transition-colors ${div.bgHover} flex flex-col justify-between ${isLastOdd ? 'lg:col-span-2 lg:flex-row lg:items-center' : ''}`}
              >
                <div className={`${isLastOdd ? 'lg:w-2/3 lg:pr-10' : ''}`}>
                  <div className="flex items-center gap-5 mb-6">
                    <div className={`p-4 rounded-full bg-white/5 border ${div.borderColor} ${div.color}`}>
                      <Icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif text-white">{div.name}</h3>
                      <span className="text-gray-500 text-sm">Sisa Kuota: {div.quota} Siswa</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 font-light leading-relaxed mb-8 text-sm md:text-base">
                    {div.desc}
                  </p>
                </div>

                <div className={`mt-auto border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-6 ${isLastOdd ? 'lg:w-1/3 lg:mt-0 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0' : ''}`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <UserCircle2 className="text-gray-500" size={18} />
                      <div>
                        <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Ketua Divisi</span>
                        <span className="text-white text-sm font-medium">{div.ketua}</span>
                      </div>
                    </div>
                    {div.wakil && (
                      <div className="flex items-center gap-3">
                        <UserCircle2 className="text-gray-500" size={18} />
                        <div>
                          <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Wakil Ketua</span>
                          <span className="text-white text-sm font-medium">{div.wakil}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    disabled={!isOpen}
                    className={`w-full md:w-auto px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 group border 
                      ${isOpen 
                        ? `bg-white/10 hover:bg-white text-white hover:text-black ${div.borderColor}` 
                        : 'bg-white/5 text-gray-500 border-white/5 cursor-not-allowed'
                      }`}
                  >
                    {isOpen ? (
                      <>Daftar <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                    ) : (
                      'Coming Soon'
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
