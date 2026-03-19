'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Server, Code, Wifi, Cloud, ArrowRight, UserCircle2, X } from 'lucide-react';
import { submitRegistration } from '@/app/actions/admin';

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
  const [selectedDiv, setSelectedDiv] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    const formData = new FormData(e.currentTarget);
    formData.append('division', selectedDiv || '');

    const res = await submitRegistration(formData);
    
    if (res.success) {
      setSuccessMsg('Pendaftaran Berhasil! Silakan cek WhatsApp Anda untuk info lebih lanjut.');
      setTimeout(() => setSelectedDiv(null), 3000); // Close after 3 seconds
    } else {
      alert(`Gagal: ${res.error}`);
    }
    setLoading(false);
  };

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
                    onClick={() => setIsOpen(isOpen ? setSelectedDiv(div.name) : undefined)}
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

      <AnimatePresence>
        {selectedDiv && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-lg p-8 rounded-[2rem] border border-white/10 relative"
            >
              <button onClick={() => setSelectedDiv(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
              
              <h3 className="text-3xl font-serif text-white mb-2">Formulir Pendaftaran</h3>
              <p className="text-ltec-cyan text-sm mb-8">Pilihan Divisi: {selectedDiv}</p>

              {successMsg ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-6 rounded-2xl text-center">
                  <p className="font-medium text-lg">{successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-5">
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Nama Lengkap</label>
                    <input name="fullName" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-ltec-cyan focus:outline-none" placeholder="Masukkan nama..." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Email</label>
                      <input type="email" name="email" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-ltec-cyan focus:outline-none" placeholder="Email aktif" />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">No. WhatsApp</label>
                      <input type="tel" name="phone" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-ltec-cyan focus:outline-none" placeholder="08xx..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Motivasi Bergabung</label>
                    <textarea name="motivation" required rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-ltec-cyan focus:outline-none resize-none" placeholder="Mengapa Anda tertarik divisi ini..." />
                  </div>
                  
                  <button disabled={loading} type="submit" className="w-full bg-ltec-cyan hover:bg-cyan-600 text-black font-medium py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] disabled:opacity-50">
                    {loading ? 'Mengirim Data...' : 'Kirim Pendaftaran'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
