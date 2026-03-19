'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, getRecruitmentStatus, toggleRecruitment, logout } from '@/app/actions/admin';
import { Power, Settings, Users, LogOut, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const sess = await getSession();
      if (!sess) {
        router.push('/admin');
        return;
      }
      setSession(sess);
      setIsOpen(await getRecruitmentStatus());
      setLoading(false);
    }
    loadData();
  }, [router]);

  const handleToggle = async () => {
    const newState = await toggleRecruitment();
    setIsOpen(newState);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin');
  };

  if (loading) return <div className="min-h-screen pt-32 flex justify-center text-white">Memuat Sistem...</div>;

  const isAdmin = session.role === 'Ketua Umum' || session.role === 'Wakil Ketua Umum';

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif text-white mb-2">Dashboard Eksekutif</h1>
            <p className="text-gray-400">Selamat datang, {session.name}. Anda login sebagai <span className="text-ltec-cyan">{session.role} ({session.division})</span>.</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm">
            <LogOut size={16} /> Keluar Sistem
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recruitment Toggle Module (Admins only) */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 col-span-1 md:col-span-2 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <Settings className="text-ltec-blue" size={24} />
              <h2 className="text-2xl font-serif text-white">Status Rekrutmen Global</h2>
            </div>
            
            <div className={`p-8 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${isOpen ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div>
                <h3 className={`text-xl font-medium mb-1 ${isOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isOpen ? 'Rekrutmen Sedang DIBUKA' : 'Rekrutmen DITUTUP (Coming Soon)'}
                </h3>
                <p className="text-sm text-gray-400">
                  {isOpen ? 'Calon anggota saat ini dapat mengisi formulir dan mendaftar di semua divisi.' : 'Seluruh formulir pendaftaran dialihkan ke status coming soon.'}
                </p>
              </div>
              
              <button 
                onClick={handleToggle}
                disabled={!isAdmin}
                className={`flex items-center gap-2 px-6 py-4 rounded-xl font-medium transition-all ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${isOpen ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}
              >
                <Power size={20} />
                {isOpen ? 'Tutup Pendaftaran' : 'Buka Pendaftaran'}
              </button>
            </div>
            {!isAdmin && (
              <p className="text-xs text-red-400 mt-4 flex items-center gap-2">
                <ShieldCheck size={14} /> Hanya Ketua Umum dan Wakil yang dapat mengubah status ini.
              </p>
            )}
          </div>

          {/* User Module */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-ltec-cyan" size={24} />
              <h2 className="text-xl font-serif text-white">Divisi Anda</h2>
            </div>
            <div className="bg-black/30 flex-grow rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full border-2 border-ltec-cyan/30 mb-4 bg-gray-800 flex items-center justify-center text-ltec-cyan text-2xl font-bold">
                {session.division.charAt(0)}
              </div>
              <h3 className="text-xl font-medium text-white mb-1">{session.division}</h3>
              <p className="text-gray-400 text-sm">Sebagai {session.role}, Anda mengendalikan penyaringan berkas divisi ini.</p>
            </div>
            <button className="w-full mt-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors text-sm">
              Lihat Data Pendaftar (Segera)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
