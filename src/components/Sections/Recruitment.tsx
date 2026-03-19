'use client';
import { motion } from 'framer-motion';
import { Calendar, Users, FileText, CheckCircle } from 'lucide-react';

const RECRUITMENT_STEPS = [
  {
    icon: FileText,
    title: "Pendaftaran Online",
    date: "10 - 20 Juli 2026",
    desc: "Isi formulir pendaftaran melalui tautan resmi kami. Pastikan Anda telah membaca semua persyaratan."
  },
  {
    icon: Users,
    title: "Seleksi Berkas & Wawancara",
    date: "22 - 25 Juli 2026",
    desc: "Tim instruktur akan meninjau motivasi dan minat Anda terhadap divisi yang dipilih."
  },
  {
    icon: Calendar,
    title: "Bootcamp Calon Anggota",
    date: "1 - 5 Agustus 2026",
    desc: "Pengenalan dasar-dasar teknologi, logika pemrograman, dan etos kerja komunitas."
  },
  {
    icon: CheckCircle,
    title: "Pengumuman Resmi",
    date: "10 Agustus 2026",
    desc: "Selamat bergabung di keluarga besar Liwa Tech Excellent Community!"
  }
];

export default function Recruitment({ isOpen = false }: { isOpen?: boolean }) {
  return (
    <section id="rekrutmen" className="py-32 bg-[#050505] relative z-10 border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] mix-blend-screen pointer-events-none rounded-[100%]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4 block">
            Open Recruitment
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
            Bergabung Bersama <span className="text-transparent bg-clip-text bg-gradient-to-r from-ltec-cyan to-indigo-400">Kami</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Pendaftaran angkatan baru telah dibuka. Daftarkan diri Anda dan mulailah perjalanan karir teknologi profesional dari sekarang!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {RECRUITMENT_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-panel p-8 rounded-[2rem] border border-white/10 hover:border-indigo-400/30 transition-colors relative group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />
                
                <div className="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-serif text-white mb-2">{step.title}</h3>
                <span className="text-ltec-cyan text-sm font-medium tracking-wide block mb-4">{step.date}</span>
                <p className="text-gray-400 font-light text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center">
          <button 
            disabled={!isOpen}
            className={`px-10 py-5 rounded-full text-lg font-medium transition-colors shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] 
              ${isOpen ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed shadow-none hover:shadow-none'}`}
          >
            {isOpen ? 'Daftar Anggota Sekarang' : 'Rekrutmen Ditutup (Coming Soon)'}
          </button>
        </div>
      </div>
    </section>
  );
}
