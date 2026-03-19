'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { login } from '@/app/actions/admin';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setSessionActive(true);
      }
    };
    checkUser();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    if (res.success) {
      router.push('/admin/dashboard');
    } else {
      setError(res.error || 'Login gagal.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-32 pb-20 flex items-center justify-center px-6">
      <div className="glass-panel p-10 rounded-[2rem] border border-white/10 w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ltec-cyan to-ltec-blue" />
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto bg-ltec-blue/10 rounded-full flex items-center justify-center text-ltec-blue mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-serif text-white mb-2">Portal Eksekutif</h1>
          <p className="text-gray-400 font-light text-sm">Masuk sebagai Pengurus Inti atau Divisi</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-medium">Email Institusi</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-ltec-cyan focus:outline-none transition-colors"
              placeholder="contoh@ltec.id"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-medium">Kata Sandi</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-ltec-cyan focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
          {sessionActive ? (
            <button 
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-4 rounded-xl transition-all shadow-lg hover:shadow-xl mt-4"
            >
              Lanjutkan ke Panel Admin
            </button>
          ) : (
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-ltec-blue hover:bg-blue-600 text-white font-medium py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 mt-4"
            >
              {loading ? 'Memverifikasi...' : 'Otorisasi Akses'}
            </button>
          )}
        </form>
      </div>
    </main>
  );
}
