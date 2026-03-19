'use client';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal } from 'lucide-react';

const ACHIEVEMENTS = [
  {
    title: "Juara Umum Lomba Kompetensi Siswa (LKS) IT/Networking",
    year: "2023 & 2024",
    level: "Tingkat Provinsi",
    icon: Trophy,
    color: "text-yellow-400"
  },
  {
    title: "Top 10 Nasional Cyber Security HackerRank",
    year: "2024",
    level: "Tingkat Nasional",
    icon: Award,
    color: "text-ltec-cyan"
  },
  {
    title: "Sertifikasi Internasional AWS & Cisco (100+ Lulusan)",
    year: "2022 - 2024",
    level: "Industri / Global",
    icon: Medal,
    color: "text-purple-400"
  }
];

export default function Achievements() {
  return (
    <section id="prestasi" className="py-32 bg-[#050505] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-ltec-cyan text-sm font-semibold tracking-widest uppercase mb-4 block">
            Jejak Prestasi
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-white">
            Penghargaan <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">& Rekognisi</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ACHIEVEMENTS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-panel p-10 rounded-3xl border border-white/10 hover:border-white/20 transition-all flex flex-col items-center text-center bg-white/5 hover:bg-white/10"
              >
                <div className={`p-4 rounded-full bg-white/5 border border-white/10 mb-6 ${item.color}`}>
                  <Icon size={40} />
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-white mb-3">{item.title}</h3>
                <span className="text-ltec-cyan text-sm font-medium tracking-wide uppercase mb-2">{item.level}</span>
                <span className="text-gray-500 font-light">{item.year}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
