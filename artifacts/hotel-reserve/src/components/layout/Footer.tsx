import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t border-primary-foreground/10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="text-2xl font-serif tracking-widest mb-4">
              VELARIS
              <span className="block text-[0.65rem] tracking-[0.3em] text-primary-foreground/60 uppercase mt-1">
                House
              </span>
            </div>
            <p className="text-primary-foreground/70 max-w-sm mt-6 text-sm leading-relaxed">
              Zamanın yavaşladığı, incelikle tasarlanmış bir konaklama deneyimi. İstanbul'un kalbinde, tarihin ve dinginliğin kesiştiği nokta.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm uppercase tracking-wider font-medium mb-6 text-primary-foreground/90">Bağlantılar</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li><Link href="/odalar" className="hover:text-white transition-colors">Odalarımız</Link></li>
              <li><Link href="/rezervasyon" className="hover:text-white transition-colors">Rezervasyon</Link></li>
              <li><Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm uppercase tracking-wider font-medium mb-6 text-primary-foreground/90">İletişim</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li>Meşrutiyet Cad. No: 15<br/>Beyoğlu, İstanbul</li>
              <li>+90 (212) 555 01 23</li>
              <li>info@velarishouse.com</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary-foreground/10 text-xs text-primary-foreground/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Velaris House. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <span>Gizlilik Politikası</span>
            <span>Şartlar ve Koşullar</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
