'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(
      '.hero-label',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    )
    .fromTo(
      '.hero-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo(
      '.hero-desc',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo(
      '.hero-actions',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.4'
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden text-center">
      {/* Background Cinematic Video/Image */}
      <div className="absolute inset-0 -z-20 bg-black">
        <motion.img
          src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop"
          alt="Cinematic Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: 'easeOut' }}
        />
        
        {/* Gradients to blend imagery with dark theme */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-transparent opacity-80" />
        
        {/* Sunrise/Cyan glow overlay */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-ltec-cyan/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-ltec-blue/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 w-full relative z-10 flex flex-col items-center">
        
        <div className="hero-label inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-ltec-cyan animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-white/80 font-medium whitespace-nowrap">
            SMK Negeri 1 Liwa • Komunitas Teknologi
          </span>
        </div>

        <h1 className="hero-title font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.1] tracking-tight text-white mb-8">
          Mencetak <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Pemimpin</span><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ltec-cyan to-ltec-blue">Teknologi Masa Depan</span>
        </h1>

        <p className="hero-desc text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-12 font-sans font-light">
          Dari keamanan siber hingga komputasi awan, LTEC mengembangkan siswa siap-industri melalui pelatihan terstruktur, kompetisi, dan pengalaman inovasi nyata.
        </p>

        <div className="hero-actions flex flex-wrap items-center justify-center gap-4">
          <Link href="/program" className="px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
            Lihat Program <ChevronRight size={18} />
          </Link>
          <Link href="/rekrutmen" className="px-8 py-4 rounded-full glass-panel border border-white/20 text-white font-medium hover:bg-white/10 transition-colors">
            Daftar Sekarang
          </Link>
        </div>
        
        <div className="hero-actions mt-16 flex items-center gap-4 glass-panel px-6 py-4 rounded-full border-ltec-cyan/30 bg-black/40">
          <div className="flex -space-x-3">
            {[1,2,3,4].map((i) => (
               <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#050505] bg-gray-700 flex items-center justify-center text-[10px] bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}')] bg-cover`} />
            ))}
          </div>
          <span className="text-sm text-gray-300 font-medium">Bergabung dengan 100+ talenta lainnya</span>
        </div>

      </div>
    </section>
  );
}
