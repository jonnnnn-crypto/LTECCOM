'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Server, Code, Network, Cloud, ArrowRight, X, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { submitRegistration } from '@/app/actions/admin';

const UI_CONFIG: any = {
  cybersecurity: { icon: Shield, color: 'from-ltec-cyan to-blue-500' },
  sysadmin: { icon: Server, color: 'from-purple-500 to-pink-500' },
  software: { icon: Code, color: 'from-emerald-400 to-teal-500' },
  network: { icon: Network, color: 'from-orange-400 to-red-500' },
  cloud: { icon: Cloud, color: 'from-blue-400 to-indigo-500' }
};

export default function DivisionRecruitment({ isOpen = false, divisions = [] }: { isOpen?: boolean, divisions?: any[] }) {
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    const formData = new FormData(e.currentTarget);
    formData.append('division', selectedDivision || '');

    const res = await submitRegistration(formData);

    if (res?.success) {
      setSuccessMsg('Pendaftaran Berhasil! Silakan cek WhatsApp Anda untuk info lebih lanjut.');
      setTimeout(() => setSelectedDivision(null), 3000);
    } else {
      alert(`Gagal: ${res?.error}`);
    }
    setLoading(false);
  };

  return (
    <section className="py-32 bg-[#050505] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-20">
          <span className="text-ltec-cyan text-sm tracking-widest uppercase mb-4 block font-semibold">Jalur Pembelajaran</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Pilih Spesialisasi Anda</h2>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Setiap divisi dirancang dengan kurikulum standar industri. Pilih jalur yang sesuai dengan minat dan ambisi karir teknologi Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {divisions.length === 0 && (
            <div className="text-gray-500 w-full col-span-1 md:col-span-2 lg:col-span-3 text-center py-20">
              Konfigurasi Divisi CMS belum tersedia.
            </div>
          )}
          {divisions.map((div, i) => {
            const cfg = UI_CONFIG[div.id] || { icon: Shield, color: 'from-gray-500 to-gray-700' };
            const Icon = cfg.icon;

            return (
              <motion.div
                key={div.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 hover:border-ltec-cyan/30 transition-colors flex flex-col justify-between group overflow-hidden relative"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cfg.color} blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity`} />

                <div>
                  <div className="flex items-center gap-5 mb-6">
                    <div className={`p-4 rounded-full bg-white/5 border border-white/10 ${cfg.color.split(' ')[0].replace('from-', 'text-')}`}>
                      <Icon size={28} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif text-white mb-2">{div.name}</h3>
                  <div className="text-sm font-medium text-ltec-cyan mb-3">Sisa Kuota: {div.remaining_quota} Siswa</div>
                  <p className="text-gray-400 font-light leading-relaxed mb-8">
                    {div.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 mt-auto">
                  <button
                    onClick={() => isOpen && setSelectedDivision(div.name)}
                    disabled={!isOpen || div.remaining_quota <= 0}
                    className={`w-full py-4 rounded-xl font-medium tracking-wide transition-all flex items-center justify-center gap-2 relative overflow-hidden group/btn disabled:opacity-50 disabled:cursor-not-allowed border
                      ${(isOpen && div.remaining_quota > 0) ? 'bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/30' : 'bg-gray-900/50 text-gray-500 border-gray-800'}`}
                  >
                    <span className="relative z-10">{(isOpen && div.remaining_quota > 0) ? 'Daftar Divisi Ini' : 'Pendaftaran Ditutup'}</span>
                    {(isOpen && div.remaining_quota > 0) && <ArrowRight size={18} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />}
                    {(isOpen && div.remaining_quota > 0) && <div className={`absolute inset-0 bg-gradient-to-r ${cfg.color} opacity-0 group-hover/btn:opacity-20 transition-opacity`} />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Registration Modal Overlay */}
      <AnimatePresence>
        {selectedDivision && (
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
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedDivision(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <span className="text-ltec-cyan text-xs font-bold tracking-widest uppercase mb-2 block">Form Pendaftaran</span>
                <h3 className="text-2xl font-serif text-white">{selectedDivision}</h3>
              </div>

              {successMsg ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <p>{successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Masukkan nama lengkap"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-ltec-cyan transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Nomor WhatsApp Valid</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      placeholder="08123456789"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-ltec-cyan transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="email@sekolah.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-ltec-cyan transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Motivasi Singkat</label>
                    <textarea
                      name="motivation"
                      required
                      placeholder="Mengapa Anda ingin masuk divisi ini?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-ltec-cyan transition-colors h-24"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-ltec-cyan text-black font-semibold py-4 rounded-xl hover:bg-ltec-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? 'Memproses Data...' : 'Kirim Pendaftaran'}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                      <AlertCircle size={12} /> Data akan dikirim ke Ketua Divisi
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
