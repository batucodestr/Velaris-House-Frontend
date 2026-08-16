import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/odalar', label: 'Odalar' },
    { href: '/iletisim', label: 'İletişim' },
    { href: '/rezervasyonlarim', label: 'Rezervasyonlarım' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled ? 'bg-background/90 backdrop-blur-md border-b border-border py-4 shadow-sm' : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="group">
          <div className="text-2xl font-serif tracking-widest text-foreground group-hover:text-primary transition-colors">
            VELARIS
            <span className="block text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase mt-1">
              House
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm tracking-wide uppercase transition-colors hover:text-primary',
                location === link.href ? 'text-primary font-medium' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/rezervasyon"
            className="bg-primary text-primary-foreground px-6 py-2.5 text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            Rezervasyon Yap
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'text-sm tracking-wide uppercase py-2',
                location === link.href ? 'text-primary font-medium' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/rezervasyon"
            onClick={() => setMobileMenuOpen(false)}
            className="bg-primary text-primary-foreground px-6 py-3 text-center text-sm uppercase tracking-wider mt-2"
          >
            Rezervasyon Yap
          </Link>
        </div>
      )}
    </header>
  );
}
