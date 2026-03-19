'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const REVIEWS = [
  {
    quote: "LTEC mengajari saya fondasi yang tidak pernah saya pelajari di kelas biasa. Sesi CTF di sini sangat intensitas tinggi mirip industri dunia nyata.",
    author: "Alumni 2024",
    role: "Anggota Cyber Security"
  },
  {
    quote: "Keterampilan mengelola server sungguhan memberikan saya lompatan karir yang masif. Saya siap bersaing di tingkat provinsi bahkan sekarang.",
    author: "Siswa Aktif",
    role: "Divisi ITNSA"
  },
  {
    quote: "Berkat metode sprint pengembangan perangkat lunak, saya kini tahu cara bekerja efektif dalam tim lincah (Agile) dan membuat aplikasi skalabel.",
    author: "Alumni 2025",
    role: "Lead Software Dev"
  },
  {
    quote: "Simulasi infrastruktur AWS dan Google Cloud Platform sangat membuka wawasan saya menuju era komputasi modern. Sangat luar biasa!",
    author: "Kontributor Aktif",
    role: "Cloud Computing"
  }
];

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    });
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden z-10">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-ltec-cyan/10 blur-[150px] mix-blend-screen pointer-events-none rounded-[100%]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-ltec-cyan text-sm tracking-widest uppercase mb-4 block font-semibold">BuktI Nyata</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white">Apa Kata Anggota Kami</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={scrollPrev}
              className="p-4 rounded-full border border-white/10 text-white hover:bg-white/10 transition-colors backdrop-blur-md"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={scrollNext}
              className="p-4 rounded-full border border-white/10 text-white hover:bg-white/10 transition-colors backdrop-blur-md"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden -ml-6" ref={emblaRef}>
          <div className="flex">
            {REVIEWS.map((review, idx) => (
              <div key={idx} className="flex-[0_0_90%] md:flex-[0_0_60%] lg:flex-[0_0_40%] pl-6">
                <div className="glass-panel p-10 md:p-12 rounded-[2rem] h-full flex flex-col justify-between border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <Quote className="text-ltec-cyan/40 mb-8" size={48} />
                    <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-serif italic mb-12 font-light">
                      "{review.quote}"
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-lg tracking-wide">{review.author}</h4>
                    <span className="text-ltec-cyan text-sm font-light uppercase tracking-widest">{review.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
