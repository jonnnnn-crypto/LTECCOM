'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getSession, getRecruitmentStatus, toggleRecruitment, logout, 
  getRegistrations, updateRegistrationStatus, deleteRegistration, deleteAllRegistrations, getProfiles, updateOwnProfile, updateProfileAdmin 
} from '@/app/actions/admin';
import { 
  getGallery, saveGalleryItem, deleteGalleryItem,
  getAchievements, saveAchievement, deleteAchievement,
  getDivisionsInfo, saveDivisionInfo,
  getTestimonials, saveTestimonial, deleteTestimonial,
  getWebinarEvents, saveWebinarEvent, deleteWebinarEvent, deleteAllWebinarEvents,
  getRecruitmentTimeline, saveRecruitmentTimeline, deleteRecruitmentTimeline,
  getDivisionMembers, saveDivisionMember, deleteDivisionMember
} from '@/app/actions/cms';
import { 
  Power, Settings, Users, LogOut, ShieldCheck, Check, X,
  AlertTriangle, Save, Image as ImageIcon, Award, Layout, MessageSquare, Menu, Calendar, Clock, Contact
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pelamar' | 'struktur' | 'galeri' | 'prestasi' | 'divisi' | 'testimoni' | 'event' | 'timeline' | 'anggota'>('pelamar');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data States
  const [applicants, setApplicants] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [webinars, setWebinars] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  // Form States
  const [procId, setProcId] = useState<string | null>(null);
  const [waInput, setWaInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState<any>({});

  const [editingCmsId, setEditingCmsId] = useState<string | null>(null);
  const [cmsForm, setCmsForm] = useState<any>({});

  const loadData = async () => {
    const sess = await getSession();
    if (!sess) {
      router.push('/admin');
      return;
    }
    setSession(sess);
    setIsOpen(await getRecruitmentStatus());
    setApplicants(await getRegistrations() || []);
    
    // Loaded by ALL Admins
    setWebinars(await getWebinarEvents() || []);
    setMembers(await getDivisionMembers() || []);

    // Loaded by Ketum / Waketum
    if (sess.role === 'Ketua Umum' || sess.role === 'Wakil Ketua Umum') {
      setProfiles(await getProfiles() || []);
      setGallery(await getGallery() || []);
      setAchievements(await getAchievements() || []);
      setTestimonials(await getTestimonials() || []);
      setTimeline(await getRecruitmentTimeline() || []);
    }

    const isInti = ['Ketua Umum', 'Wakil Ketua Umum', 'Sekretaris Umum', 'Bendahara Umum'].includes(sess.role);
    const isKetuaDivisi = ['Ketua Divisi', 'Wakil Ketua Divisi'].includes(sess.role);
    
    // Everyone in Inti + Divisi Leaders can configure Quotas
    if (isInti || isKetuaDivisi) {
      setDivisions(await getDivisionsInfo() || []);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleLogout = async () => { await logout(); router.push('/admin'); };

  const handleToggleRecruitment = async () => {
    setProcId('toggle_rec');
    const n = await toggleRecruitment();
    setIsOpen(n);
    setProcId(null);
  };

  const processRegistration = async (id: string, phone: string, name: string, div: string, status: 'interview' | 'accepted' | 'rejected') => {
    setProcId(id);
    const res = await updateRegistrationStatus(id, phone, name, div, status);
    if (!res?.success) alert('Gagal memproses pelamar: ' + (res?.error || 'Koneksi terputus/Timeout'));
    await loadData();
    setProcId(null);
  };

  const handleUpdateProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waInput || !nameInput) return;
    setProcId('profile_setup');
    const res = await updateOwnProfile({ phone_number: waInput, full_name: nameInput });
    if (res.success) {
      setSession({ ...session, phone_number: waInput, name: nameInput });
      alert("Profil berhasil disahkan!");
    } else alert(`Gagal: ${res.error}`);
    setProcId(null);
  };

  // Generic Save Handlers
  const handleSaveProfile = async (id: string) => {
    setProcId(id);
    const res = await updateProfileAdmin(id, profileForm);
    if (res.success) {
      setProfiles(prev => prev.map(x => x.id === id ? { ...x, ...profileForm } : x));
      setEditingProfileId(null);
    } else alert(`Gagal: ${res.error}`);
    setProcId(null);
  };

  const handleSaveGallery = async () => {
    setProcId('save_gallery');
    const res = await saveGalleryItem(editingCmsId === 'NEW' ? null : editingCmsId, cmsForm);
    if (res.success) { setEditingCmsId(null); await loadData(); } else alert(`Gagal: ${res.error}`);
    setProcId(null);
  };

  const handleDeleteGallery = async (id: string) => {
    setProcId(id);
    await deleteGalleryItem(id);
    await loadData();
    setProcId(null);
  };

  const handleSaveAchievement = async () => {
    setProcId('save_ach');
    const res = await saveAchievement(editingCmsId === 'NEW' ? null : editingCmsId, cmsForm);
    if (res.success) { setEditingCmsId(null); await loadData(); } else alert(`Gagal: ${res.error}`);
    setProcId(null);
  };

  const handleDeleteAchievement = async (id: string) => {
    setProcId(id);
    await deleteAchievement(id);
    await loadData();
    setProcId(null);
  };

  const handleSaveDivision = async (id: string) => {
    setProcId(`div-${id}`);
    const divTarget = cmsForm[id];
    const res = await saveDivisionInfo(id, { name: divTarget.name, quota: parseInt(divTarget.quota), description: divTarget.description, whatsapp_group_link: divTarget.whatsapp_group_link });
    if (res.success) { await loadData(); } else alert(`Gagal: ${res.error}`);
    setProcId(null);
  };

  const handleSaveTestimonial = async () => {
    setProcId('save_testi');
    const res = await saveTestimonial(editingCmsId === 'NEW' ? null : editingCmsId, cmsForm);
    if (res.success) { setEditingCmsId(null); await loadData(); } else alert(`Gagal: ${res.error}`);
    setProcId(null);
  };

  const handleDeleteTestimonial = async (id: string) => {
    setProcId(id);
    await deleteTestimonial(id);
    await loadData();
    setProcId(null);
  };

  const handleSaveWebinar = async () => {
    setProcId('save_webinar');
    const res = await saveWebinarEvent(editingCmsId === 'NEW' ? null : editingCmsId, cmsForm);
    if (res.success) { setEditingCmsId(null); await loadData(); } else alert(`Gagal: ${res.error}`);
    setProcId(null);
  };

  const handleDeleteWebinar = async (id: string) => {
    setProcId(id);
    await deleteWebinarEvent(id);
    await loadData();
    setProcId(null);
  };

  const handleDeleteAllWebinars = async () => {
    setProcId('confirm_clear_webinars');
  };

  const executeClearWebinars = async () => {
    setProcId('clearing_webinars');
    const res = await deleteAllWebinarEvents();
    if (!res?.success) alert('Gagal menghapus event: ' + (res?.error || 'Database error'));
    await loadData();
    setProcId(null);
  };

  const handleSaveTimeline = async () => {
    setProcId('save_timeline');
    const res = await saveRecruitmentTimeline(editingCmsId === 'NEW' ? null : editingCmsId, cmsForm);
    if (res.success) { setEditingCmsId(null); await loadData(); } else alert(`Gagal: ${res.error}`);
    setProcId(null);
  };

  const handleDeleteTimeline = async (id: string) => {
    setProcId(id);
    await deleteRecruitmentTimeline(id);
    await loadData();
    setProcId(null);
  };

  const handleSaveMember = async () => {
    setProcId('save_member');
    const res = await saveDivisionMember(editingCmsId === 'NEW' ? null : editingCmsId, cmsForm);
    if (res.success) { setEditingCmsId(null); await loadData(); } else alert(`Gagal: ${res.error}`);
    setProcId(null);
  };

  const handleDeleteMember = async (id: string) => {
    setProcId(id);
    await deleteDivisionMember(id);
    await loadData();
    setProcId(null);
  };

  // Start edit helpers
  const startEditGallery = (item?: any) => {
    if (item) { setEditingCmsId(item.id); setCmsForm(item); }
    else { setEditingCmsId('NEW'); setCmsForm({ title: '', category: '', image_url: '' }); }
  };
  const startEditAchievement = (item?: any) => {
    if (item) { setEditingCmsId(item.id); setCmsForm(item); }
    else { setEditingCmsId('NEW'); setCmsForm({ title: '', date: '', description: '', image_url: '' }); }
  };
  const startEditTestimonial = (item?: any) => {
    if (item) { setEditingCmsId(item.id); setCmsForm(item); }
    else { setEditingCmsId('NEW'); setCmsForm({ name: '', role: '', content: '', image_url: '' }); }
  };
  const startEditWebinar = (item?: any) => {
    if (item) { setEditingCmsId(item.id); setCmsForm(item); }
    else { setEditingCmsId('NEW'); setCmsForm({ title: '', description: '', type: 'Webinar', link: '', image_url: '' }); }
  };
  const startEditTimeline = (item?: any) => {
    if (item) { setEditingCmsId(item.id); setCmsForm(item); }
    else { setEditingCmsId('NEW'); setCmsForm({ step_number: 1, title: '', date_range: '', description: '' }); }
  };
  const startEditMember = (item?: any) => {
    if (item) { setEditingCmsId(item.id); setCmsForm(item); }
    else { setEditingCmsId('NEW'); setCmsForm({ name: '', role: 'Anggota', batch_year: new Date().getFullYear().toString(), photo_url: '', division: session?.role === 'Ketua Umum' || session?.role === 'Wakil Ketua Umum' ? '' : session?.division }); }
  };
  const startEditDivisions = () => {
    const defaultForms: any = {};
    divisions.forEach(d => { defaultForms[d.id] = { name: d.name, quota: d.quota, description: d.description, whatsapp_group_link: d.whatsapp_group_link || '' }; });
    setCmsForm(defaultForms);
    setEditingCmsId('ALL');
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-ltec-cyan">Memuat Integrasi CMS...</div>;

  const isAdmin = session?.role === 'Ketua Umum' || session?.role === 'Wakil Ketua Umum';
  const isInti = isAdmin || session?.role === 'Sekretaris Umum' || session?.role === 'Bendahara Umum';
  const isDivisionLeader = session?.role === 'Ketua Divisi' || session?.role === 'Wakil Ketua Divisi';
  const canManageQuota = isInti || isDivisionLeader;
  
  const needsProfileSetup = isDivisionLeader && (!session?.phone_number || session?.phone_number.includes('08123456789') || session?.name?.startsWith('Ketua Divisi') || session?.name?.startsWith('Wakil Ketua'));

  if (needsProfileSetup) {
    return (
      <main className="min-h-screen bg-[#050505] p-6 pt-32 relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-red-500/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="glass-panel max-w-lg w-full p-10 rounded-[2.5rem] border border-red-500/20 text-center relative z-10 box-glow-red">
          <AlertTriangle size={48} className="mx-auto text-red-400 mb-6" />
          <h2 className="text-2xl font-serif text-white mb-2">Lengkapi Data Diri Pimpinan</h2>
          <p className="text-gray-400 text-sm mb-8">Sebagai Pimpinan Divisi, lengkapi Nama Asli Anda dan Nomor WhatsApp untuk menjamin validitas kepengurusan dan fungsi layanan Notifikasi Broadcaster.</p>
          <form onSubmit={handleUpdateProfileSetup} className="space-y-5">
            <div className="text-left">
              <label className="text-xs text-gray-400 mb-1 ml-1 block">Nama Lengkap Anda</label>
              <input type="text" required value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="Contoh: Budi Santoso" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-400 outline-none" />
            </div>
            <div className="text-left">
              <label className="text-xs text-gray-400 mb-1 ml-1 block">Nomor WhatsApp Aktif</label>
              <input type="tel" required value={waInput} onChange={e => setWaInput(e.target.value)} placeholder="0812..." className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-400 outline-none" />
            </div>
            <button type="submit" disabled={procId === 'profile_setup'} className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl disabled:opacity-50 transition font-medium">{procId ? 'Menyimpan...' : 'Sahkan Profil Saya'}</button>
          </form>
          <button onClick={handleLogout} className="mt-6 text-gray-500 hover:text-white text-sm">Kembali / Logout</button>
        </div>
      </main>
    );
  }

  const TABS = [
    { id: 'pelamar', label: 'Pelamar Divisi', icon: Users, adminOnly: false },
    { id: 'anggota', label: 'Anggota Divisi', icon: Contact, adminOnly: false },
    { id: 'event', label: 'Event & Webinar', icon: Calendar, adminOnly: false },
    { id: 'timeline', label: 'Timeline Rekrutmen', icon: Clock, adminOnly: true },
    { id: 'struktur', label: 'Struktur Pengurus', icon: ShieldCheck, adminOnly: true },
    { id: 'galeri', label: 'Galeri Publik', icon: ImageIcon, adminOnly: true },
    { id: 'prestasi', label: 'Prestasi', icon: Award, adminOnly: true },
    { id: 'divisi', label: 'Divisi & Kuota', icon: Layout, adminOnly: false, quotaAuth: true },
    { id: 'testimoni', label: 'Testimoni', icon: MessageSquare, adminOnly: true },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row font-sans text-gray-100 selection:bg-ltec-cyan/30">
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="font-serif font-bold text-lg text-white">LTEC CMS</div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-white/5 rounded-lg text-white">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-full md:w-64 flex flex-col bg-black/40 border-r border-white/5 md:flex md:sticky md:top-0 h-auto md:h-screen z-40 ${sidebarOpen ? 'block fixed inset-0 top-[69px]' : 'hidden md:flex'}`}>
        <div className="p-6">
          <h2 className="text-2xl font-serif text-white hidden md:block">LTEC <span className="text-ltec-cyan">Admin</span></h2>
          <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">Login Aktif:</p>
            <p className="text-white font-medium truncate">{session?.name}</p>
            <p className="text-ltec-cyan text-xs font-semibold tracking-wider uppercase mt-1">{session?.role}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {TABS.map(tab => {
            if (tab.adminOnly && !isAdmin) return null;
            if (tab.quotaAuth && !canManageQuota) return null;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setEditingCmsId(null); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                  ${activeTab === tab.id ? 'bg-ltec-cyan/10 text-ltec-cyan border border-ltec-cyan/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            )
          })}
        </nav>

        <div className="p-6 mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors font-medium">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto w-full relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-ltec-cyan/5 blur-[150px] pointer-events-none rounded-full" />
        
        {/* Dynamic Header based on Role */}
        {isAdmin && activeTab === 'pelamar' && (
           <div className="mb-10 p-6 md:p-8 rounded-[2rem] border border-ltec-cyan/20 bg-gradient-to-r from-ltec-cyan/5 to-transparent flex flex-col md:flex-row justify-between items-center gap-6">
             <div>
               <h1 className="text-3xl font-serif text-white mb-2">Sistem Rekrutmen Utama</h1>
               <p className="text-gray-400 text-sm">Kendalikan arus pendaftaran terbuka dan akses pantau keseluruhan peminat LTEC.</p>
             </div>
             <button
                onClick={handleToggleRecruitment}
                disabled={procId === 'toggle_rec'}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all shadow-lg
                  ${isOpen ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500/30'}`}
              >
                <Power size={20} /> {procId === 'toggle_rec' ? 'Memproses...' : (isOpen ? 'TUTUP Pendaftaran' : 'BUKA Pendaftaran')}
              </button>
           </div>
        )}

        <div className="relative z-10 glass-panel min-h-[500px] rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl">
          
          {/* TAB: PELAMAR */}
          {activeTab === 'pelamar' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-2xl font-serif text-white">Database Pelamar {isAdmin ? 'Global' : 'Divisi'}</h2>
                   <span className="text-gray-400 text-sm">{applicants.filter(app => isAdmin || app.division_choice === session?.division).length} Total Berkas</span>
                 </div>
                 {isAdmin && (
                   <button 
                     onClick={async () => {
                       if (procId === 'confirm_clear_all') {
                         setProcId('clearing_all');
                         const res = await deleteAllRegistrations();
                         if (!res?.success) alert('Gagal membersihkan data: ' + res?.error);
                         await loadData();
                         setProcId(null);
                       } else {
                         setProcId('confirm_clear_all');
                       }
                     }} 
                     className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm rounded-lg border border-red-500/20 transition flex items-center gap-2 font-medium"
                   >
                     {procId === 'clearing_all' ? 'Dibersihkan...' : procId === 'confirm_clear_all' ? 'Yakin Hapus Semua?' : 'Bersihkan Semua Data'}
                   </button>
                 )}
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500 text-sm">
                      <th className="p-4">Calon</th>
                      <th className="p-4">Kontak</th>
                      {!isAdmin && <th className="p-4">Pilihan Divisi</th>}
                      {isAdmin && <th className="p-4">Pilihan Divisi</th>}
                      <th className="p-4">Alasan Bergabung</th>
                      <th className="p-4 text-center">Tindakan Keputusan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.filter(app => isAdmin || app.division_choice === session?.division).map(app => (
                      <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="p-4 text-white font-medium">{app.full_name}</td>
                        <td className="p-4 text-gray-400 text-sm">{app.phone_number}<br/>{app.email}</td>
                        {!isAdmin && <td className="p-4 text-ltec-cyan text-sm">{app.division_choice}</td>}
                        {isAdmin && <td className="p-4 text-ltec-cyan text-sm">{app.division_choice}</td>}
                        <td className="p-4 text-gray-400 text-sm max-w-xs truncate">{app.motivation}</td>
                        <td className="p-4">
                          <div className="flex flex-col items-center justify-center gap-2 w-full max-w-[150px] mx-auto">
                            {(app.status === 'pending' || !app.status || app.status === 'interview') && (
                              <select 
                                value="" 
                                onChange={(e) => {
                                  if(e.target.value) {
                                    processRegistration(app.id, app.phone_number, app.full_name, app.division_choice, e.target.value as any);
                                  }
                                }}
                                className="px-3 py-2 bg-black col-span-1 border border-white/20 rounded-lg text-xs font-semibold text-white focus:border-ltec-cyan outline-none cursor-pointer w-full text-center hover:bg-white/5 transition"
                                disabled={!!procId}
                              >
                                <option value="">{procId === app.id ? 'Memproses...' : '-- Tentukan --'}</option>
                                {(app.status === 'pending' || !app.status) && <option value="interview">LOLOS BERKAS</option>}
                                {(app.status === 'pending' || !app.status) && <option value="rejected">TOLAK BERKAS</option>}
                                {app.status === 'interview' && <option value="accepted">TERIMA ANGGOTA</option>}
                                {app.status === 'interview' && <option value="rejected">GUGUR WAWANCARA</option>}
                              </select>
                            )}
                            {app.status === 'interview' && (
                              <span className="text-indigo-400 text-[10px] font-bold tracking-widest bg-indigo-500/10 px-3 py-1 mt-1 rounded-full border border-indigo-500/20 text-center w-full block">TAHAP WAWANCARA</span>
                            )}
                            {app.status === 'rejected' && (
                              <div className="text-center font-bold tracking-widest text-xs mb-1 w-full">
                                <span className="text-red-500 block px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">DITOLAK</span>
                              </div>
                            )}
                            <button 
                              onClick={async () => { 
                                if(procId === `confirm_${app.id}`) { 
                                  setProcId(`del_${app.id}`); 
                                  await deleteRegistration(app.id); 
                                  await loadData(); 
                                  setProcId(null); 
                                } else { 
                                  setProcId(`confirm_${app.id}`); 
                                } 
                              }} 
                              disabled={procId === `del_${app.id}`} 
                              className="text-[11px] text-red-500/50 hover:text-red-500 border border-red-500/20 rounded px-3 py-1 mt-2 transition w-fit font-medium tracking-wide uppercase"
                            >
                              {procId === `del_${app.id}` ? 'MENGHAPUS...' : procId === `confirm_${app.id}` ? 'KLIK LAGI (YAKIN?)' : 'HAPUS DATA'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {applicants.filter(app => isAdmin || app.division_choice === session?.division).length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500 italic">Belum ada data pelamar.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: EVENT & WEBINAR */}
          {activeTab === 'event' && (
             <div>
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-2xl font-serif text-white">Event & Webinar Manager</h2>
                   <p className="text-sm text-gray-400">Jadwalkan Webinar, Lomba, atau Kampus Visit. Publik dapat melihat ini.</p>
                 </div>
                 <div className="flex gap-3 flex-wrap">
                   {webinars.length > 0 && (
                     <button onClick={() => {
                        if (procId === 'confirm_clear_webinars') executeClearWebinars();
                        else handleDeleteAllWebinars();
                     }} className="px-4 py-2 bg-red-500/20 text-red-500 font-semibold rounded-lg text-sm hover:opacity-80 border border-red-500/30 transition-colors">
                       {procId === 'clearing_webinars' ? 'Sedang Menghapus...' : procId === 'confirm_clear_webinars' ? 'Klik Sekali Lagi (Konfirmasi)' : 'Bersihkan Semua Event'}
                     </button>
                   )}
                   <button onClick={() => startEditWebinar()} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 font-semibold rounded-lg text-sm hover:opacity-80 border border-emerald-500/30 transition-colors">+ Tambah Event Baru</button>
                 </div>
               </div>
               
               {editingCmsId && (
                 <div className="bg-white/5 p-6 rounded-2xl border border-emerald-500/30 mb-8 max-w-2xl">
                   <h3 className="text-lg text-white mb-4">{editingCmsId === 'NEW' ? 'Perancangan Agenda Baru' : 'Ubah Agenda'}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <input placeholder="Judul Seminar / Perlombaan" value={cmsForm.title} onChange={e => setCmsForm({...cmsForm, title: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white md:col-span-2" />
                     <select value={cmsForm.type} onChange={e => setCmsForm({...cmsForm, type: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white md:col-span-2">
                        <option value="Webinar">Webinar</option>
                        <option value="Lomba">Lomba (CTF / Kompetisi)</option>
                        <option value="Lainnya">Lainnya</option>
                     </select>
                     <textarea placeholder="Deskripsi Event" value={cmsForm.description} onChange={e => setCmsForm({...cmsForm, description: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white md:col-span-2 h-24" />
                     <input placeholder="URL Pendaftaran (Link Google Form)" value={cmsForm.link} onChange={e => setCmsForm({...cmsForm, link: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white md:col-span-2" />
                     <input placeholder="URL Banner Gambar (Opsional)" value={cmsForm.image_url} onChange={e => setCmsForm({...cmsForm, image_url: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white md:col-span-2" />
                   </div>
                   <div className="flex justify-end gap-3">
                     <button onClick={() => setEditingCmsId(null)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                     <button onClick={handleSaveWebinar} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium">{procId ? 'Menyimpan...' : 'Simpan Event'}</button>
                   </div>
                 </div>
               )}

               <div className="space-y-4">
                 {webinars.map(item => (
                   <div key={item.id} className="p-5 bg-white/5 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-emerald-500/20 transition-colors">
                     <div className="flex-1">
                       <div className="flex flex-wrap items-center gap-3 mb-2">
                         <span className="text-xs font-bold tracking-widest text-black bg-emerald-400 px-2 py-1 rounded">{item.type}</span>
                       </div>
                       <h4 className="text-xl text-white font-medium mb-1">{item.title}</h4>
                       <p className="text-sm text-gray-400 mb-2 line-clamp-2">{item.description}</p>
                       <p className="text-xs text-ltec-cyan">Dibuat oleh: {item.created_by}</p>
                     </div>
                     <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                       <button onClick={() => startEditWebinar(item)} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl flex-1 md:flex-none text-center grid place-items-center"><Settings size={18}/></button>
                       <button onClick={() => handleDeleteWebinar(item.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/30 rounded-xl flex-1 md:flex-none text-center grid place-items-center"><X size={18}/></button>
                     </div>
                   </div>
                 ))}
                 {webinars.length === 0 && <p className="text-gray-500 italic py-10 text-center border border-white/5 rounded-2xl border-dashed">Belum ada jadwal Event maupun Webinar yang dirancang.</p>}
               </div>
             </div>
          )}

          {/* TAB: TIMELINE REKRUTMEN */}
          {activeTab === 'timeline' && isAdmin && (
             <div>
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-2xl font-serif text-white">Timeline Rekrutmen</h2>
                   <p className="text-sm text-gray-400">Tahapan dan jadwal seleksi rekrutmen yang ditampilkan secara publik.</p>
                 </div>
                 <button onClick={() => startEditTimeline()} className="px-4 py-2 bg-indigo-500/20 text-indigo-400 font-semibold rounded-lg text-sm hover:opacity-80 border border-indigo-500/30">+ Tambah Tahapan</button>
               </div>
               
               {editingCmsId && (
                 <div className="bg-white/5 p-6 rounded-2xl border border-indigo-500/30 mb-8 max-w-2xl">
                   <h3 className="text-lg text-white mb-4">{editingCmsId === 'NEW' ? 'Tahapan Baru' : 'Ubah Tahapan'}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <div>
                       <label className="text-xs text-gray-500 block mb-1">Nomor Urutan (1-10)</label>
                       <input type="number" placeholder="1" value={cmsForm.step_number} onChange={e => setCmsForm({...cmsForm, step_number: parseInt(e.target.value)})} className="bg-black border border-white/10 p-3 rounded-lg text-white w-full" />
                     </div>
                     <div>
                       <label className="text-xs text-gray-500 block mb-1">Judul Tahapan</label>
                       <input placeholder="Pendaftaran Online" value={cmsForm.title} onChange={e => setCmsForm({...cmsForm, title: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white w-full" />
                     </div>
                     <div>
                       <label className="text-xs text-gray-500 block mb-1">Rentang Tanggal</label>
                       <input placeholder="10 - 20 Juli 2026" value={cmsForm.date_range} onChange={e => setCmsForm({...cmsForm, date_range: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white w-full md:col-span-2" />
                     </div>
                     <textarea placeholder="Deskripsi tahapan..." value={cmsForm.description} onChange={e => setCmsForm({...cmsForm, description: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white md:col-span-2 h-24" />
                   </div>
                   <div className="flex justify-end gap-3">
                     <button onClick={() => setEditingCmsId(null)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                     <button onClick={handleSaveTimeline} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium">{procId ? 'Menyimpan...' : 'Simpan'}</button>
                   </div>
                 </div>
               )}

               <div className="space-y-4">
                 {timeline.map(item => (
                   <div key={item.id} className="p-5 bg-white/5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center gap-4 hover:border-indigo-500/20 transition-colors">
                     <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/30 text-xl font-serif shrink-0">{item.step_number}</div>
                     <div className="flex-1">
                       <h4 className="text-lg text-white font-medium mb-1">{item.title}</h4>
                       <span className="text-sm font-semibold tracking-widest text-ltec-cyan mb-2 block">{item.date_range}</span>
                       <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                     </div>
                     <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                       <button onClick={() => startEditTimeline(item)} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl flex-1 md:flex-none text-center grid place-items-center"><Settings size={18}/></button>
                       <button onClick={() => handleDeleteTimeline(item.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/30 rounded-xl flex-1 md:flex-none text-center grid place-items-center"><X size={18}/></button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {/* TAB: ANGGOTA DIVISI */}
          {activeTab === 'anggota' && (
             <div>
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-2xl font-serif text-white">Database Anggota Divisi</h2>
                   <p className="text-sm text-gray-400">Data registri alumni dan member aktif {isAdmin ? 'Semua Divisi' : `Divisi ${session?.division || ''}`}.</p>
                 </div>
                 <button onClick={() => startEditMember()} className="px-4 py-2 bg-cyan-500/20 text-cyan-400 font-semibold rounded-lg text-sm hover:opacity-80 border border-cyan-500/30">+ Tambah Anggota</button>
               </div>
               
               {editingCmsId && (
                 <div className="bg-white/5 p-6 rounded-2xl border border-cyan-500/30 mb-8 max-w-2xl">
                   <h3 className="text-lg text-white mb-4">{editingCmsId === 'NEW' ? 'Input Anggota Baru' : 'Edit Anggota'}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <input placeholder="Nama Lengkap" value={cmsForm.name} onChange={e => setCmsForm({...cmsForm, name: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white" />
                     <select value={cmsForm.role} onChange={e => setCmsForm({...cmsForm, role: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white">
                        <option value="Anggota">Anggota</option>
                        <option value="Ketua Divisi">Ketua Divisi</option>
                        <option value="Wakil Ketua Divisi">Wakil Ketua Divisi</option>
                     </select>
                     <input placeholder="Tahun Angkatan (Misal: 2024)" value={cmsForm.batch_year} onChange={e => setCmsForm({...cmsForm, batch_year: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white" />
                     
                     {isAdmin ? (
                       <select value={cmsForm.division} onChange={e => setCmsForm({...cmsForm, division: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white">
                          <option value="">-- Pilih Divisi --</option>
                          {divisions.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                       </select>
                     ) : (
                       <input disabled value={session?.division || ''} className="bg-black/50 border border-white/10 p-3 rounded-lg text-gray-500" />
                     )}
                     
                     <input placeholder="URL Foto Profile (Opsional)" value={cmsForm.photo_url} onChange={e => setCmsForm({...cmsForm, photo_url: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white md:col-span-2" />
                   </div>
                   <div className="flex justify-end gap-3">
                     <button onClick={() => setEditingCmsId(null)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                     <button onClick={handleSaveMember} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg font-medium">{procId ? 'Menyimpan...' : 'Simpan'}</button>
                   </div>
                 </div>
               )}

               <div className="overflow-x-auto">
                 <table className="w-full text-left min-w-[700px]">
                   <thead>
                     <tr className="border-b border-white/10 text-gray-500 text-sm">
                       <th className="p-4">Biodata</th>
                       <th className="p-4">Angkatan</th>
                       <th className="p-4">Divisi & Peran</th>
                       <th className="p-4 text-right">Opsi</th>
                     </tr>
                   </thead>
                   <tbody>
                     {members.filter(m => isAdmin || m.division === session?.division).map(item => (
                       <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                         <td className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
                               {item.photo_url && <img src={item.photo_url} className="w-full h-full object-cover" />}
                            </div>
                            <span className="font-medium text-white">{item.name}</span>
                         </td>
                         <td className="p-4 text-ltec-cyan tracking-widest text-sm">{item.batch_year}</td>
                         <td className="p-4">
                            <p className="text-white text-sm">{item.division}</p>
                            <p className="text-gray-400 text-xs">{item.role}</p>
                         </td>
                         <td className="p-4 text-right">
                           <button onClick={() => startEditMember(item)} className="p-2 bg-white/10 hover:bg-white/20 rounded mr-2"><Settings size={14}/></button>
                           <button onClick={() => handleDeleteMember(item.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/30 rounded"><X size={14}/></button>
                         </td>
                       </tr>
                     ))}
                     {members.filter(m => isAdmin || m.division === session?.division).length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-500 italic">Belum ada anggota yang didaftarkan.</td></tr>}
                   </tbody>
                 </table>
               </div>
             </div>
          )}

          {/* TAB: STRUKTUR PENGURUS */}
          {activeTab === 'struktur' && isAdmin && (
            <div>
              <h2 className="text-2xl font-serif text-white mb-2">Manajemen Profil Ekspos</h2>
              <p className="text-gray-400 text-sm mb-6">Perbarui Nama, URL Foto, dan Nomor Kontak para pimpinan. Semua profil yang aktif akan ditampilkan otomatis di halaman Divisi.</p>
              
              <table className="w-full text-left border-collapse min-w-[800px] overflow-x-auto block">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-sm tracking-wider uppercase">
                    <th className="p-4 font-medium w-64">Nama & Posisi</th>
                    <th className="p-4 font-medium">WhatsApp</th>
                    <th className="p-4 font-medium">Link Foto URL</th>
                    <th className="p-4 font-medium text-right w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="w-full">
                  {profiles.map(p => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      {editingProfileId === p.id ? (
                        <>
                          <td className="p-4">
                            <input className="w-full bg-black/50 border border-white/10 p-2 text-white rounded outline-none" value={profileForm.full_name} onChange={e => setProfileForm({...profileForm, full_name: e.target.value})} />
                            <div className="text-xs text-ltec-cyan mt-1">{p.role} - {p.division}</div>
                          </td>
                          <td className="p-4"><input className="w-full bg-black/50 border border-white/10 p-2 text-white rounded outline-none" value={profileForm.phone_number} onChange={e => setProfileForm({...profileForm, phone_number: e.target.value})} /></td>
                          <td className="p-4"><input className="w-full bg-black/50 border border-white/10 p-2 text-white rounded outline-none" value={profileForm.photo_url} onChange={e => setProfileForm({...profileForm, photo_url: e.target.value})} /></td>
                          <td className="p-4 text-right flex gap-2 justify-end">
                            <button onClick={() => handleSaveProfile(p.id)} className="p-2 bg-emerald-500/20 text-emerald-400 rounded"><Save size={16}/></button>
                            <button onClick={() => setEditingProfileId(null)} className="p-2 bg-white/10 text-white rounded"><X size={16}/></button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-4"><p className="text-white font-medium">{p.full_name}</p><p className="text-xs text-ltec-cyan">{p.role} - {p.division}</p></td>
                          <td className="p-4 text-sm text-gray-300">{p.phone_number || '-'}</td>
                          <td className="p-4 text-sm text-gray-400 truncate max-w-[200px]">{p.photo_url ? 'Link Aktif' : 'Kosong'}</td>
                          <td className="p-4 text-right">
                            <button onClick={() => { setEditingProfileId(p.id); setProfileForm({ full_name: p.full_name, phone_number: p.phone_number || '', photo_url: p.photo_url || '' }); }} className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 hover:text-white rounded text-xs flex items-center gap-2"><Settings size={14}/> Edit</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: GALERI */}
          {activeTab === 'galeri' && isAdmin && (
            <div>
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-serif text-white">Manajemen Galeri Publik</h2>
                 <button onClick={() => startEditGallery()} className="px-4 py-2 bg-ltec-cyan text-black font-semibold rounded-lg text-sm hover:opacity-80">+ Tambah Foto</button>
               </div>
               
               {editingCmsId && (
                 <div className="bg-white/5 p-6 rounded-2xl border border-ltec-cyan/30 mb-8">
                   <h3 className="text-lg text-white mb-4">{editingCmsId === 'NEW' ? 'Tambah Item Baru' : 'Edit Item'}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <input placeholder="Judul / Deskripsi Pendek" value={cmsForm.title} onChange={e => setCmsForm({...cmsForm, title: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white" />
                     <input placeholder="Kategori (Kunjungan, Prestasi, Latihan)" value={cmsForm.category} onChange={e => setCmsForm({...cmsForm, category: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white" />
                     <input placeholder="Image URL (Wajib)" value={cmsForm.image_url} onChange={e => setCmsForm({...cmsForm, image_url: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white md:col-span-2" />
                   </div>
                   <div className="flex justify-end gap-3">
                     <button onClick={() => setEditingCmsId(null)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                     <button onClick={handleSaveGallery} className="px-4 py-2 bg-ltec-cyan text-black rounded-lg font-medium">{procId ? 'Menyimpan...' : 'Simpan'}</button>
                   </div>
                 </div>
               )}

               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                 {gallery.map(item => (
                   <div key={item.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 group">
                     <div className="h-40 bg-black overflow-hidden"><img src={item.image_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" alt="Galeri" /></div>
                     <div className="p-4">
                       <p className="text-xs text-ltec-cyan mb-1">{item.category}</p>
                       <p className="font-medium text-white mb-4 line-clamp-1">{item.title}</p>
                       <div className="flex gap-2">
                         <button onClick={() => startEditGallery(item)} className="px-3 py-1 bg-white/10 rounded flex-1 text-xs hover:bg-white/20">Edit</button>
                         <button onClick={() => handleDeleteGallery(item.id)} className="px-3 py-1 bg-red-500/20 text-red-500 rounded flex-1 text-xs hover:bg-red-500/40">Hapus</button>
                       </div>
                     </div>
                   </div>
                 ))}
                 {gallery.length === 0 && <div className="text-gray-500 text-sm mt-5">Tidak ada foto di galeri publik.</div>}
               </div>
            </div>
          )}

          {/* TAB: PRESTASI */}
          {activeTab === 'prestasi' && isAdmin && (
             <div>
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-serif text-white">Pajangan Prestasi</h2>
                 <button onClick={() => startEditAchievement()} className="px-4 py-2 bg-ltec-cyan text-black font-semibold rounded-lg text-sm hover:opacity-80">+ Tambah Prestasi</button>
               </div>
               
               {editingCmsId && (
                 <div className="bg-white/5 p-6 rounded-2xl border border-ltec-cyan/30 mb-8">
                   <h3 className="text-lg text-white mb-4">{editingCmsId === 'NEW' ? 'Tambah Prestasi Baru' : 'Edit Prestasi'}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <input placeholder="Judul Prestasi Lomba" value={cmsForm.title} onChange={e => setCmsForm({...cmsForm, title: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white" />
                     <input placeholder="Tanggal (cth. Aug 2024)" value={cmsForm.date} onChange={e => setCmsForm({...cmsForm, date: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white" />
                     <textarea placeholder="Deskripsi pendek" value={cmsForm.description} onChange={e => setCmsForm({...cmsForm, description: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white md:col-span-2 h-24" />
                     <input placeholder="Image URL (Opsional / Gambar Trofi)" value={cmsForm.image_url} onChange={e => setCmsForm({...cmsForm, image_url: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white md:col-span-2" />
                   </div>
                   <div className="flex justify-end gap-3">
                     <button onClick={() => setEditingCmsId(null)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                     <button onClick={handleSaveAchievement} className="px-4 py-2 bg-ltec-cyan text-black rounded-lg font-medium">{procId ? 'Menyimpan...' : 'Simpan'}</button>
                   </div>
                 </div>
               )}

               <div className="space-y-4">
                 {achievements.map(item => (
                   <div key={item.id} className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center gap-4">
                     <div className="flex-1">
                       <h4 className="text-white font-medium">{item.title}</h4>
                       <p className="text-sm text-gray-400 mb-1">{item.date}</p>
                       <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                     </div>
                     <div className="flex gap-2">
                       <button onClick={() => startEditAchievement(item)} className="p-2 bg-white/10 hover:bg-white/20 rounded"><Settings size={18}/></button>
                       <button onClick={() => handleDeleteAchievement(item.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/30 rounded"><X size={18}/></button>
                     </div>
                   </div>
                 ))}
                 {achievements.length === 0 && <div className="text-gray-500 text-sm mt-5">Belum ada rekapitulasi prestasi.</div>}
               </div>
             </div>
          )}

          {/* TAB: DIVISI */}
          {activeTab === 'divisi' && canManageQuota && (
             <div>
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-2xl font-serif text-white">Deskripsi & Kuota Divisi</h2>
                   <p className="text-sm text-gray-400 mt-1">Konfigurasi batasan kuota pendaftaran yang tertera di Halaman Panduan Pendaftaran.</p>
                 </div>
                 {editingCmsId !== 'ALL' && <button onClick={() => startEditDivisions()} className="px-4 py-2 bg-ltec-cyan text-black font-semibold rounded-lg text-sm hover:opacity-80">Edit Seluruh Kuota</button>}
                 {editingCmsId === 'ALL' && <button onClick={() => { setEditingCmsId(null); loadData(); }} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">Batal Edit</button>}
               </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {divisions.map(div => {
                    const isEditing = editingCmsId === 'ALL';
                    // Divis Leaders only see their own division, Inti sees all
                    if (!isInti && session?.division !== div.name) return null;
                    
                    return (
                      <div key={div.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl relative">
                       {isEditing ? (
                         <div className="space-y-3">
                           <div className="font-bold text-ltec-cyan mb-2 border-b border-ltec-cyan/30 pb-2">{div.id.toUpperCase()}</div>
                           <div><label className="text-xs text-gray-500">Nama Tampil</label><input className="w-full bg-black border border-white/10 mt-1 p-2 rounded text-white" value={cmsForm[div.id]?.name || ''} onChange={(e) => setCmsForm({...cmsForm, [div.id]: {...cmsForm[div.id], name: e.target.value}})} /></div>
                           <div><label className="text-xs text-gray-500">Kuota Limit (Angka)</label><input type="number" className="w-full bg-black border border-white/10 mt-1 p-2 rounded text-white" value={cmsForm[div.id]?.quota || 0} onChange={(e) => setCmsForm({...cmsForm, [div.id]: {...cmsForm[div.id], quota: e.target.value}})} /></div>
                           <div><label className="text-xs text-gray-500">Link Grup WhatsApp (Akan Terkirim Saat Diterima)</label><input placeholder="https://chat.whatsapp.com/..." className="w-full bg-black border border-white/10 mt-1 p-2 rounded text-white" value={cmsForm[div.id]?.whatsapp_group_link || ''} onChange={(e) => setCmsForm({...cmsForm, [div.id]: {...cmsForm[div.id], whatsapp_group_link: e.target.value}})} /></div>
                           <div><label className="text-xs text-gray-500">Deskripsi Pendek</label><textarea className="w-full bg-black border border-white/10 mt-1 p-2 rounded text-white h-20" value={cmsForm[div.id]?.description || ''} onChange={(e) => setCmsForm({...cmsForm, [div.id]: {...cmsForm[div.id], description: e.target.value}})} /></div>
                           <button onClick={() => handleSaveDivision(div.id)} className="w-full mt-2 py-2 bg-emerald-500/20 text-emerald-400 font-semibold rounded hover:bg-emerald-500/40 border border-emerald-500/30">{procId === `div-${div.id}` ? '...' : 'Terapkan Update'}</button>
                         </div>
                       ) : (
                         <>
                           <h4 className="font-serif text-lg text-white mb-1">{div.name}</h4>
                           <p className="text-2xl font-bold text-ltec-cyan mb-3">{div.quota} Kuota Tersedia</p>
                           <p className="text-sm text-gray-400">{div.description}</p>
                         </>
                       )}
                     </div>
                   )
                 })}
               </div>
             </div>
          )}

          {/* TAB: TESTIMONI */}
          {activeTab === 'testimoni' && isAdmin && (
             <div>
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-serif text-white">Manajemen Testimoni</h2>
                 <button onClick={() => startEditTestimonial()} className="px-4 py-2 bg-ltec-cyan text-black font-semibold rounded-lg text-sm hover:opacity-80">+ Tambah Testimoni</button>
               </div>
               
               {editingCmsId && (
                 <div className="bg-white/5 p-6 rounded-2xl border border-ltec-cyan/30 mb-8">
                   <h3 className="text-lg text-white mb-4">{editingCmsId === 'NEW' ? 'Tambah Testimoni Baru' : 'Edit Testimoni'}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <input placeholder="Nama Lengkap Alumni/Anggota" value={cmsForm.name} onChange={e => setCmsForm({...cmsForm, name: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white" />
                     <input placeholder="Peran / Kelas / Pekerjaan (cth. Alumni 2023)" value={cmsForm.role} onChange={e => setCmsForm({...cmsForm, role: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white" />
                     <textarea placeholder="Pesan / Kutipan..." value={cmsForm.content} onChange={e => setCmsForm({...cmsForm, content: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white md:col-span-2 h-24" />
                     <input placeholder="URL Foto Muka (Opsional)" value={cmsForm.image_url} onChange={e => setCmsForm({...cmsForm, image_url: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg text-white md:col-span-2" />
                   </div>
                   <div className="flex justify-end gap-3">
                     <button onClick={() => setEditingCmsId(null)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                     <button onClick={handleSaveTestimonial} className="px-4 py-2 bg-ltec-cyan text-black rounded-lg font-medium">{procId ? 'Menyimpan...' : 'Simpan'}</button>
                   </div>
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {testimonials.map(item => (
                   <div key={item.id} className="p-6 bg-white/5 rounded-2xl border border-white/10 relative group">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 shrink-0">
                           {item.image_url && <img src={item.image_url} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                           <p className="font-bold text-white">{item.name}</p>
                           <p className="text-xs text-ltec-cyan">{item.role}</p>
                        </div>
                     </div>
                     <p className="text-sm text-gray-300 italic">"{item.content}"</p>
                     
                     <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                       <button onClick={() => startEditTestimonial(item)} className="p-2 bg-white/20 hover:bg-white/40 rounded backdrop-blur-sm"><Settings size={14} className="text-white"/></button>
                       <button onClick={() => handleDeleteTestimonial(item.id)} className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500/40 rounded backdrop-blur-sm"><X size={14}/></button>
                     </div>
                   </div>
                 ))}
                 {testimonials.length === 0 && <div className="text-gray-500 text-sm mt-5 col-span-2">Belum ada Testimoni untuk dibaca.</div>}
               </div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
}
