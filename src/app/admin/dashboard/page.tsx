'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, getRecruitmentStatus, toggleRecruitment, logout, getRegistrations, updateRegistrationStatus, getProfiles, updateOwnProfile, updateProfileAdmin } from '@/app/actions/admin';
import { Power, Settings, Users, LogOut, ShieldCheck, Check, X, Camera, Save, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [procId, setProcId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pelamar' | 'struktur'>('pelamar');
  const [waInput, setWaInput] = useState('');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState<any>({});
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
      setApplicants(regs || []);
      
      if (sess.role === 'Ketua Umum' || sess.role === 'Wakil Ketua Umum') {
        const profs = await getProfiles();
        setProfiles(profs);
      }
      
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

  const handleUpdateWA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waInput) return;
    setProcId('wa_update');
    const res = await updateOwnProfile({ phone_number: waInput });
    if (res.success) {
      setSession({ ...session, phone_number: waInput });
      alert("Nomor WA berhasil disimpan!");
    } else {
      alert(`Gagal menyimpan: ${res.error}`);
    }
    setProcId(null);
  };

  const startEditProfile = (p: any) => {
    setEditingProfileId(p.id);
    setProfileForm({ full_name: p.full_name, phone_number: p.phone_number, photo_url: p.photo_url || '' });
  };

  const handleSaveProfile = async (id: string) => {
    setProcId(id);
    const res = await updateProfileAdmin(id, profileForm);
    if (res.success) {
      setProfiles(prev => prev.map(x => x.id === id ? { ...x, ...profileForm } : x));
      setEditingProfileId(null);
    } else {
      alert(`Gagal update: ${res.error}`);
    }
    setProcId(null);
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Memuat...</div>;

  const isAdmin = session?.role === 'Ketua Umum' || session?.role === 'Wakil Ketua Umum';
  const isDivisionLeader = session?.role === 'Ketua Divisi' || session?.role === 'Wakil Ketua Divisi';
  
  // MANDATORY WA GATE
  const needsWAUpdate = isDivisionLeader && (!session?.phone_number || session?.phone_number.includes('08123456789'));

  if (needsWAUpdate) {
    return (
      <main className="min-h-screen bg-[#050505] p-6 pt-32 relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-red-500/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="glass-panel max-w-lg w-full p-10 rounded-[2.5rem] border border-red-500/20 text-center relative z-10 box-glow-red">
          <AlertTriangle size={48} className="mx-auto text-red-400 mb-6" />
          <h2 className="text-2xl font-serif text-white mb-2">Pemberitahuan Sistem</h2>
          <p className="text-gray-400 text-sm mb-8">
            Sebagai pimpinan divisi, Anda *diwajibkan* untuk mengisi Nomor WhatsApp aktif. Sistem akan secara otomatis memberikan nomor Anda kepada para pelamar yang <span className="text-emerald-400">Diterima</span> agar mereka dapat menghubungi Anda!
          </p>
          <form onSubmit={handleUpdateWA} className="space-y-4">
            <input 
              type="tel" required
              value={waInput} onChange={e => setWaInput(e.target.value)}
              placeholder="Contoh: 08123456xxxx"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:border-red-400 focus:outline-none"
            />
            <button 
              type="submit" disabled={procId === 'wa_update'}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50"
            >
              {procId === 'wa_update' ? 'Menyimpan...' : 'Simpan Nomor WA'}
            </button>
          </form>
          <button onClick={handleLogout} className="mt-6 text-gray-500 hover:text-white text-sm">Logout / Kembali</button>
        </div>
      </main>
    );
  }

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
              Status Online
            </button>
          </div>
        </div>

        {/* Tab Switcher for Admins */}
        {isAdmin && (
          <div className="flex gap-4 mt-8 mb-4">
            <button 
              onClick={() => setActiveTab('pelamar')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'pelamar' ? 'bg-ltec-cyan text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              Manajemen Pelamar
            </button>
            <button 
              onClick={() => setActiveTab('struktur')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'struktur' ? 'bg-ltec-cyan text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              Manajemen Struktur & Foto
            </button>
          </div>
        )}

        {/* Tab: Pelamar (Default) */}
        {activeTab === 'pelamar' && (
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
      )}

      {/* Tab: Struktur (Admin Only) */}
      {isAdmin && activeTab === 'struktur' && (
        <div className="glass-panel p-8 rounded-3xl border border-white/10 mt-6 relative overflow-x-auto min-h-[400px] box-glow">
          <h2 className="text-2xl font-serif text-white mb-2">Manajemen Profil Ekspos</h2>
          <p className="text-gray-400 text-sm mb-6">Perbarui Nama, URL Foto, dan Nomor Kontak para pimpinan untuk menyesuaikan tampilan di halaman Struktur Organisasi.</p>
          
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm tracking-wider uppercase">
                <th className="p-4 font-medium w-64">Nama Lengkap & Posisi</th>
                <th className="p-4 font-medium">No. WhatsApp</th>
                <th className="p-4 font-medium">Link Foto URL (Unsplash/ImgBB)</th>
                <th className="p-4 font-medium text-right w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  {editingProfileId === p.id ? (
                    <>
                      <td className="p-4">
                        <input className="w-full bg-black/50 border border-white/10 p-2 text-white rounded focus:border-ltec-cyan outline-none" value={profileForm.full_name} onChange={e => setProfileForm({...profileForm, full_name: e.target.value})} placeholder="Nama..." />
                        <div className="text-xs text-gray-500 mt-1">{p.role} - {p.division}</div>
                      </td>
                      <td className="p-4">
                         <input className="w-full bg-black/50 border border-white/10 p-2 text-white rounded focus:border-ltec-cyan outline-none" value={profileForm.phone_number} onChange={e => setProfileForm({...profileForm, phone_number: e.target.value})} placeholder="08..." />
                      </td>
                      <td className="p-4">
                         <input className="w-full bg-black/50 border border-white/10 p-2 text-white rounded focus:border-ltec-cyan outline-none" value={profileForm.photo_url} onChange={e => setProfileForm({...profileForm, photo_url: e.target.value})} placeholder="https://..." />
                      </td>
                      <td className="p-4 text-right flex gap-2 justify-end">
                        <button disabled={procId === p.id} onClick={() => handleSaveProfile(p.id)} className="p-2 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/40"><Save size={16}/></button>
                        <button disabled={procId === p.id} onClick={() => setEditingProfileId(null)} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40"><X size={16}/></button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4">
                        <p className="text-white font-medium">{p.full_name}</p>
                        <p className="text-xs text-gray-500">{p.role} - {p.division}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-300">{p.phone_number}</td>
                      <td className="p-4 text-sm text-gray-400 truncate max-w-[200px]">
                        {p.photo_url ? (
                          <a href={p.photo_url} target="_blank" className="text-blue-400 hover:underline">View Photo</a>
                        ) : 'Kosong'}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => startEditProfile(p)} className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 hover:text-white rounded hover:bg-white/10 text-xs flex items-center gap-2 transition">
                          <Settings size={14} /> Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </main>
  );
}
