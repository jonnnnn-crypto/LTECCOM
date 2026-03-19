'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Tentang', href: '/tentang' },
    { label: 'Program', href: '/program' },
    { label: 'Divisi', href: '/divisi' },
    { label: 'Perjalanan', href: '/perjalanan' },
    { label: 'Galeri', href: '/galeri' },
    { label: 'Prestasi', href: '/prestasi' },
    { label: 'Kontak', href: '/kontak' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between glass-panel rounded-full px-6 py-3 border border-white/10 bg-black/20 backdrop-blur-xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif font-bold text-xl tracking-tight text-white hover:text-ltec-cyan transition-colors">
              LTEC
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors tracking-wide"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link 
              href="/rekrutmen"
              className="hidden md:flex items-center justify-center px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/20 transition-all hover:border-ltec-cyan shadow-lg"
            >
              Gabung Komunitas
            </Link>
            
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-6 right-6 mt-4 p-6 glass-panel rounded-3xl md:hidden flex flex-col gap-4 border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl"
            >
              {navItems.map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="w-full h-[1px] bg-white/10 my-2" />
              <Link 
                href="/rekrutmen"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center px-5 py-3 rounded-xl bg-ltec-blue text-white text-base font-medium transition-all hover:bg-blue-600"
              >
                Gabung Komunitas
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
