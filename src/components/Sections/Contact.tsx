'use client';
import { Mail, Instagram, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <section id="kontak" className="py-32 bg-[#050505] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-ltec-cyan text-sm font-semibold tracking-widest uppercase mb-4 block">
            Hubungi Kami
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-white">
            Punya Pertanyaan?
          </h2>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto font-light leading-relaxed">
            Terhubung dengan tim LTEC untuk informasi kemitraan industri, pendaftaran keanggotaan, atau kegiatan sekolah lainnya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <a href="mailto:contact@ltec.smkn1liwa.sch.id" className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-ltec-cyan/50 transition-colors flex flex-col items-center text-center group">
            <Mail className="text-gray-400 group-hover:text-ltec-cyan mb-4 transition-colors" size={32} />
            <h4 className="text-white font-medium mb-2">Email</h4>
            <span className="text-gray-400 font-light text-sm">contact@ltec.smkn1liwa.sch.id</span>
          </a>
          
          <a href="https://instagram.com/ltec" target="_blank" rel="noreferrer" className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-ltec-cyan/50 transition-colors flex flex-col items-center text-center group">
            <Instagram className="text-gray-400 group-hover:text-ltec-cyan mb-4 transition-colors" size={32} />
            <h4 className="text-white font-medium mb-2">Instagram</h4>
            <span className="text-gray-400 font-light text-sm">@ltec_smkn1liwa</span>
          </a>
          
          <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center group">
            <MapPin className="text-gray-400 group-hover:text-ltec-cyan mb-4 transition-colors" size={32} />
            <h4 className="text-white font-medium mb-2">Lokasi</h4>
            <span className="text-gray-400 font-light text-sm">Lab Komputer Terpadu, SMK Negeri 1 Liwa</span>
          </div>
        </div>
      </div>
    </section>
  );
}
