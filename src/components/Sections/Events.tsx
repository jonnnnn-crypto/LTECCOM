'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const EVENTS_DATA = [
  {
    title: "Juara Umum LKS IT/Networking Provinsi 2024",
    date: "Oktober 2024",
    category: "Kompetisi",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    colSpan: "md:col-span-2",
  },
  {
    title: "Kunjungan Industri & Data Center Kominfo",
    date: "September 2024",
    category: "Kegiatan Eksternal",
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
    colSpan: "md:col-span-1",
  },
  {
    title: "Sertifikasi Profesional Mikrotik MTCNA",
    date: "Agustus 2024",
    category: "Ujian Sertifikasi",
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
    colSpan: "md:col-span-1",
  },
  {
    title: "LTEC Hackathon & Sprint Coding 48 Jam",
    date: "Juli 2024",
    category: "Event Internal",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
    colSpan: "md:col-span-2",
  },
  {
    title: "Instalasi Fiber Optik Lingkungan Sekolah",
    date: "Juni 2024",
    category: "Praktik Lapangan",
    img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop",
    colSpan: "md:col-span-2",
  },
  {
    title: "Pelatihan Kesadaran Keamanan Siber",
    date: "Mei 2024",
    category: "Workshop Internal",
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
    colSpan: "md:col-span-1",
  },
  {
    title: "Bootcamp Calon Anggota Angkatan VI",
    date: "Maret 2024",
    category: "Pendidikan & Kaderisasi",
    img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop",
    colSpan: "md:col-span-3",
  }
];

export default function Events() {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EVENTS_DATA.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`group relative h-[400px] rounded-[2rem] overflow-hidden ${event.colSpan} cursor-pointer border border-white/10 shadow-2xl`}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 z-10" />
              <img 
                src={event.img} 
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent flex flex-col justify-end p-8 z-20">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="inline-block px-3 py-1.5 rounded-full bg-ltec-cyan/20 text-ltec-cyan text-[10px] font-bold tracking-widest uppercase border border-ltec-cyan/20 backdrop-blur-md">
                      {event.category}
                    </span>
                    <span className="text-gray-300 text-sm font-light tracking-wide">{event.date}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif text-white">{event.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
