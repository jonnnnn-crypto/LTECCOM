'use client';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MOMENTS = [
  {
    id: 1,
    title: 'Konfigurasi Server Nyata',
    category: 'ITNSA',
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Kompetisi Capture The Flag',
    category: 'Cyber Security',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Sesi Sprints Algoritma',
    category: 'Software Dev',
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Instalasi Datacenter Mini',
    category: 'Network Cabling',
    img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop',
  }
];

export default function FeaturedMoments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const panels = gsap.utils.toArray('.moment-panel');
    
    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        start: 'center center',
        end: () => "+=" + window.innerWidth * 2
      }
    });

    // Reveal text
    gsap.fromTo('.moment-header', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: '.moment-header', start: 'top 80%' } }
    );
  }, { scope: containerRef });

  return (
    <section id="dokumentasi" ref={containerRef} className="bg-[#050505] overflow-hidden min-h-screen flex flex-col justify-center relative">
      <div className="moment-header max-w-7xl mx-auto px-6 mb-12 w-full pt-20">
        <h2 className="text-4xl md:text-6xl font-serif font-medium text-white mb-6">
          Pengalaman di dalam <span className="text-transparent bg-clip-text bg-gradient-to-r from-ltec-cyan to-ltec-blue">LTEC</span>
        </h2>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light">
          Sekilas pandangan tentang sesi pelatihan nyata, kolaborasi intensif, dan pengerjaan inovasi dari dalam ekosistem komunitas kami.
        </p>
      </div>

      <div ref={scrollRef} className="flex flex-nowrap w-[400vw] md:w-[250vw] pl-6 md:pl-[calc((100vw-80rem)/2)] pb-20">
        {MOMENTS.map((moment) => (
          <div key={moment.id} className="moment-panel w-[90vw] md:w-[60vw] px-4 flex-shrink-0">
            <div className="relative h-[60vh] md:h-[65vh] rounded-[2rem] overflow-hidden group border border-white/10 shadow-2xl">
              <img 
                src={moment.img} 
                alt={moment.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 filter brightness-75 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-ltec-cyan/20 text-ltec-cyan text-xs font-semibold tracking-widest uppercase mb-4 backdrop-blur-md border border-ltec-cyan/20">
                    {moment.category}
                  </span>
                  <h3 className="text-3xl md:text-5xl font-serif text-white">{moment.title}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
