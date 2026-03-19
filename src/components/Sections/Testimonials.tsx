'use client';
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function Testimonials({ testimonials = [] }: { testimonials?: any[] }) {
  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden z-10">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-ltec-cyan/10 blur-[150px] mix-blend-screen pointer-events-none rounded-[100%]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Suara <span className="text-ltec-cyan">Anggota</span></h2>
          </div>

          {testimonials.length === 0 ? (
            <div className="text-center text-gray-500 py-10">Belum ada data testimoni.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {testimonials.map((t, i) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="glass-panel p-10 rounded-3xl border border-white/10 hover:border-ltec-cyan/50 hover:bg-white/5 transition-all group relative"
                >
                  <Quote className="absolute top-8 right-8 text-ltec-cyan/20 w-16 h-16 group-hover:text-ltec-cyan/40 transition-colors" />
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-ltec-cyan/30 group-hover:border-ltec-cyan transition-colors">
                      <img src={t.image_url || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop'} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-white font-serif text-lg">{t.name}</h4>
                      <p className="text-ltec-cyan text-xs tracking-wider uppercase">{t.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 font-light leading-relaxed italic relative z-10">
                    "{t.content}"
                  </p>
                </motion.div>
              ))}
            </div>
          )}
      </div>
    </section>
  );
}
