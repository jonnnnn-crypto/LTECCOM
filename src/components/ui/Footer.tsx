import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#050505] pt-32 pb-12 border-t border-white/5 relative overflow-hidden z-10">
      {/* Top Border Glow Visual */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-ltec-cyan/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-ltec-cyan/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Final CTA Board */}
        <div id="gabung" className="glass-panel rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden border border-ltec-cyan/20 mb-32 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-ltec-cyan/10 to-transparent z-0" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-ltec-blue/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Mulai Perjalanan Teknologi Anda Hari Ini</h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Jadilah bagian dari generasi yang membangun, mengamankan, dan berinovasi untuk masa depan digital. Sebuah program unggulan berdampak tinggi, sepenuhnya gratis untuk siswa SMK Negeri 1 Liwa.
            </p>
            <Link href="/rekrutmen" className="inline-block px-10 py-5 rounded-full bg-white text-black text-lg font-medium hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]">
              Gabung Komunitas LTEC
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          {/* Brand Info */}
          <div className="lg:col-span-4 lg:pr-12">
            <h3 className="font-serif font-bold text-3xl text-white mb-6 flex items-center gap-3">
              <img src="/liwa.png" alt="LTEC" className="w-8 h-8 object-contain" />
              LTEC <span className="w-2 h-2 rounded-full bg-ltec-cyan animate-pulse mt-1" />
            </h3>
            <p className="text-gray-400 font-light leading-relaxed mb-6">
              Build Skills. Secure the Future. Compete Globally. Komunitas keunggulan teknologi di SMK Negeri 1 Liwa yang mencetak pemimpin masa depan.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 font-medium text-sm border border-white/10 px-4 py-2 rounded-full bg-white/5">Program Edukasi Gratis</span>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-medium mb-6 uppercase tracking-widest text-sm">Jelajahi</h4>
            <ul className="space-y-4">
              <li><Link href="/tentang" className="text-gray-400 hover:text-ltec-cyan transition-colors font-light">Tentang LTEC</Link></li>
              <li><Link href="/program" className="text-gray-400 hover:text-ltec-cyan transition-colors font-light">Program</Link></li>
              <li><Link href="/event" className="text-gray-400 hover:text-ltec-cyan transition-colors font-light">Agenda & Event</Link></li>
              <li><Link href="/perjalanan" className="text-gray-400 hover:text-ltec-cyan transition-colors font-light">Jejak Langkah</Link></li>
              <li><Link href="/galeri" className="text-gray-400 hover:text-ltec-cyan transition-colors font-light">Galeri Kegiatan</Link></li>
              <li><Link href="/prestasi" className="text-gray-400 hover:text-ltec-cyan transition-colors font-light">Prestasi LTEC</Link></li>
              <li><Link href="/kontak" className="text-gray-400 hover:text-ltec-cyan transition-colors font-light">Hubungi Kami</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-white font-medium mb-6 uppercase tracking-widest text-sm">Divisi</h4>
            <ul className="space-y-4">
              <li><Link href="/divisi" className="text-gray-400 font-light hover:text-white transition-colors">Cyber Security</Link></li>
              <li><Link href="/divisi" className="text-gray-400 font-light hover:text-white transition-colors">IT Network SysAdmin</Link></li>
              <li><Link href="/divisi" className="text-gray-400 font-light hover:text-white transition-colors">Software Development</Link></li>
              <li><Link href="/divisi" className="text-gray-400 font-light hover:text-white transition-colors">Network Cabling</Link></li>
              <li><Link href="/divisi" className="text-gray-400 font-light hover:text-white transition-colors">Cloud Computing</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-medium mb-6 uppercase tracking-widest text-sm">Tetap Terhubung</h4>
            <p className="text-gray-400 font-light mb-4 text-sm leading-relaxed">Berlangganan nawala kami untuk informasi aktivitas dan kompetisi terbaru.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Masukkan alamat email Anda" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full text-white placeholder:text-gray-500 focus:outline-none focus:border-ltec-cyan transition-colors text-sm"
                required
              />
              <button 
                type="submit"
                className="bg-ltec-blue text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors w-full"
              >
                Berlangganan
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 font-light text-sm">
            © {new Date().getFullYear()} Liwa Tech Excellent Community.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-white transition-colors text-sm font-light">Kebijakan Privasi</a>
            <a href="#" className="text-gray-600 hover:text-white transition-colors text-sm font-light">Syarat Layanan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
