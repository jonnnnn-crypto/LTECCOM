'use client';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Compass } from 'lucide-react';

export default function VisionMission() {
  return (
    <section className="py-24 bg-[#050505] relative z-10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-ltec-cyan/10 border border-ltec-cyan/30 flex items-center justify-center text-ltec-cyan">
                <Target size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-white">Visi Kami</h2>
            </div>
            <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed border-l-2 border-ltec-cyan pl-6 italic">
              "Menjadi kiblat komunitas teknologi pendidikan vokasi di Indonesia yang mencetak inovator, ahli keamanan siber, dan insinyur perangkat lunak berstandar global pada tahun 2026."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full h-80 rounded-[2rem] overflow-hidden relative border border-white/10"
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
              alt="Kolaborasi Visi"
              className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </motion.div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white flex items-center justify-center gap-4">
            <Compass className="text-ltec-blue" size={36} /> Misi Utama
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Ekosistem Belajar Nyata",
              desc: "Menyediakan infrastruktur dan mentoring yang menyerupai lingkungan industri teknologi sesungguhnya bagi tiap siswa SMK Negeri 1 Liwa."
            },
            {
              title: "Budaya Kompetisi Global",
              desc: "Mempersiapkan kader LTEC untuk mendominasi Lomba Kompetensi Siswa (LKS) tingkat nasional dan turnamen CTF elit di seluruh Asia."
            },
            {
              title: "Sertifikasi Industri IT",
              desc: "Membimbing anggota untuk mencapai sertifikasi valid bertaraf internasional (AWS, Cisco, Mikrotik, RedHat) sebelum mereka lulus."
            }
          ].map((misi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-panel p-10 rounded-3xl border border-white/10 hover:border-ltec-blue/50 transition-colors bg-white/5"
            >
              <Lightbulb className="text-yellow-400 mb-6" size={32} />
              <h3 className="text-2xl font-serif text-white mb-4">{misi.title}</h3>
              <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">{misi.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
