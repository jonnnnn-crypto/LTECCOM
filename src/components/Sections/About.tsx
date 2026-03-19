'use client';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="tentang" className="py-24 bg-[#050505] relative z-10 border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-ltec-cyan/5 blur-[150px] mix-blend-screen pointer-events-none rounded-[100%]" />
      
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <span className="text-ltec-cyan text-sm font-semibold tracking-widest uppercase mb-6 block">
          Tentang LTEC
        </span>
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl lg:text-6xl font-serif text-white max-w-5xl mx-auto leading-tight font-light"
        >
          Kami lebih dari sekadar komunitas. LTEC adalah <span className="text-transparent bg-clip-text bg-gradient-to-r from-ltec-cyan to-ltec-blue font-medium">inkubator teknologi</span> SMK Negeri 1 Liwa yang mencetak pelajar menjadi talenta siap industri.
        </motion.h2>
      </div>
    </section>
  );
}
