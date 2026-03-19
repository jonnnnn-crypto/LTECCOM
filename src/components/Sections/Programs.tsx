import { Shield, Server, Code, Network, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const PROGRAMS = [
  {
    title: 'Cyber Security',
    desc: 'Simulasi peretasan etis, analisis kerentanan, dan persiapan CTF untuk kompetisi nasional.',
    icon: Shield,
    color: 'from-purple-500 to-indigo-500'
  },
  {
    title: 'IT Network SysAdmin',
    desc: 'Administrasi server tingkat lanjut, konfigurasi jaringan, dan lingkungan simulasi perusahaan.',
    icon: Server,
    color: 'from-ltec-cyan to-ltec-blue'
  },
  {
    title: 'Software Development',
    desc: 'Membangun aplikasi web modern dan menyelesaikan studi kasus bisnis melalui kode dan logika.',
    icon: Code,
    color: 'from-green-400 to-emerald-600'
  },
  {
    title: 'Network Cabling',
    desc: 'Desain infrastruktur fisik, instalasi serat optik, dan teknik pengelolaan kabel presisi tinggi.',
    icon: Network,
    color: 'from-orange-400 to-red-500'
  },
  {
    title: 'Cloud Computing',
    desc: 'Implementasi, komputasi skala besar, dan manajemen sistem di lingkungan virtual dan cloud.',
    icon: Cloud,
    color: 'from-blue-400 to-cyan-500'
  }
];

export default function Programs() {
  return (
    <section id="program" className="py-32 bg-[#050505] relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <span className="text-ltec-cyan text-sm font-semibold tracking-widest uppercase mb-4 block">
              Jalur Pembelajaran
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-white">
              Program Pelatihan <br />
              <span className="text-gray-500">Unggulan Kami</span>
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-md font-light leading-relaxed">
            Dapatkan keterampilan khusus di sektor teknologi permintaan tinggi persis seperti format profesional industri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROGRAMS.map((prog, index) => {
            const Icon = prog.icon;
            return (
              <motion.div
                key={prog.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-panel p-8 rounded-[2rem] relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500`}
              >
                {/* Glow Effect */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${prog.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
                
                <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform duration-500`}>
                  <Icon size={28} />
                </div>
                
                <h3 className="text-2xl font-serif font-medium text-white mb-4">
                  {prog.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed font-light mb-8">
                  {prog.desc}
                </p>

                <div className="w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent mt-auto" />
              </motion.div>
            )
          })}
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="glass-panel p-8 rounded-[2rem] border border-ltec-cyan/30 bg-ltec-cyan/5 flex flex-col justify-center items-center text-center hover:bg-ltec-cyan/10 transition-colors"
          >
            <h3 className="text-2xl font-serif text-white mb-4">Siap Membangun Karir?</h3>
            <Link href="/rekrutmen" className="px-8 py-4 rounded-full bg-ltec-blue text-white font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-ltec-blue/20">
              Daftar Program Sekarang
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
