'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Trophy, Medal, Star, Target } from 'lucide-react';

export default function Achievements({ achievements = [] }: { achievements?: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section id="prestasi" className="py-32 bg-[#050505] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-ltec-cyan text-sm font-semibold tracking-widest uppercase mb-4 block">
            Jejak Prestasi
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-white">
            Penghargaan <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">& Rekognisi</span>
          </h2>
        </div>

        <div className="space-y-12 relative z-10">
          {achievements.length === 0 ? (
             <div className="text-center text-gray-400 py-10">Belum ada data prestasi.</div>
          ) : achievements.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="glass-panel p-6 md:p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-ltec-cyan/30 transition-colors"
            >
              {/* Card Glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-[80px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`} />
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden relative shadow-2xl shrink-0">
                   <img src={item.image_url || 'https://images.unsplash.com/photo-1561489404-4712ce17b81b?q=80&w=800&auto=format&fit=crop'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                   <div className={`absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 shadow-lg`}>
                     <div className="w-full h-full bg-black/50 rounded-[10px] flex items-center justify-center backdrop-blur-sm">
                       <Trophy className="text-white w-6 h-6" />
                     </div>
                   </div>
                </div>

                <div className="flex-1 relative z-10">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-ltec-cyan mb-4 uppercase">
                    {item.date}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif text-white mb-4 leading-tight group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
