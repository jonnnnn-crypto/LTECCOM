'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';


export default function Events({ gallery = [] }: { gallery?: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  return (
    <section id="galeri" className="py-32 bg-[#050505] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-ltec-cyan text-sm font-semibold tracking-widest uppercase mb-4 block">
              Galeri Kegiatan
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-white">
              Dokumentasi <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ltec-cyan to-ltec-blue">Event LTEC</span>
            </h2>
          </div>
          <button className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors flex items-center gap-2 w-max text-sm font-medium backdrop-blur-md">
            Lihat Semua Foto <ArrowUpRight size={18} />
          </button>
        </div>

        {gallery.length === 0 ? (
          <div className="text-center text-gray-400 min-h-[50vh] flex items-center justify-center">Belum ada album galeri.</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 p-6 max-w-[1600px] mx-auto">
          {gallery.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.1 }}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-black/50 border border-white/10 hover:border-ltec-cyan/50 transition-colors"
            >
              <img 
                src={event.image_url} 
                alt={event.title}
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-ltec-cyan mb-4 w-max">
                  {event.category}
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-white font-medium leading-snug">
                  {event.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
