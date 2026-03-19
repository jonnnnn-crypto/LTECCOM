'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, getRecruitmentStatus, toggleRecruitment, logout, getRegistrations, updateRegistrationStatus } from '@/app/actions/admin';
import { Power, Settings, Users, LogOut, ShieldCheck, Check, X } from 'lucide-react';

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [procId, setProcId] = useState<string | null>(null);
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
      
      const regs = await getRegistrations();
      // Role logic is already strictly applied via Supabase RLS!
      // 'getRegistrations()' implicitly returns ONLY rows this logged-in role is allowed to see!
      setApplicants(regs || []);
      
      setLoading(false);
    }
    loadData();
  }, [router]);

  const handleToggle = async () => {
    const newState = await toggleRecruitment();
    setIsOpen(newState);
  };

  const handleStatusChange = async (id: string, phone: string, name: string, division: string, status: 'accepted' | 'rejected') => {
    if (!confirm(`Tandai pelamar ini sebagai ${status}?`)) return;
    setProcId(id);
    const res = await updateRegistrationStatus(id, phone, name, division, status);
    if (res.success) {
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } else {
      alert(`Gagal: ${res.error}`);
    }
    setProcId(null);
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
            <button className="w-full mt-4 py-3 rounded-xl border border-white/10 text-gray-300 transition-colors text-sm cursor-default">
              Total Pelamar Tampil: {applicants.length}
            </button>
          </div>
        </div>

        {/* Database Registrations Module */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 mt-6 relative overflow-x-auto min-h-[400px]">
          <h2 className="text-2xl font-serif text-white mb-6">Database Pelamar {isAdmin ? 'Global' : 'Divisi'}</h2>
          
          {applicants.length === 0 ? (
            <div className="text-center py-20 text-gray-500">Belum ada pelamar.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm tracking-wider uppercase">
                  <th className="p-4 font-medium">Nama / Email</th>
                  <th className="p-4 font-medium">Divisi Opsi</th>
                  <th className="p-4 font-medium">No. WA</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="text-white font-medium">{app.full_name}</p>
                      <p className="text-xs text-gray-500">{app.email}</p>
                    </td>
                    <td className="p-4 text-sm text-ltec-cyan">{app.division_choice}</td>
                    <td className="p-4 text-sm text-gray-300">{app.phone_number}</td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${
                        app.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 
                        app.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {app.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            disabled={procId === app.id}
                            onClick={() => handleStatusChange(app.id, app.phone_number, app.full_name, app.division_choice, 'accepted')}
                            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 transition disabled:opacity-50"
                            title="Terima"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            disabled={procId === app.id}
                            onClick={() => handleStatusChange(app.id, app.phone_number, app.full_name, app.division_choice, 'rejected')}
                            className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/40 transition disabled:opacity-50"
                            title="Tolak"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
