import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-serif text-primary mb-6">404</h1>
        <h2 className="text-2xl font-serif mb-4 text-foreground">Sayfa Bulunamadı</h2>
        <p className="text-muted-foreground mb-8 text-balance">
          Aradığınız sayfaya şu anda ulaşılamıyor. Velaris House'un sakinliğine geri dönmek için ana sayfaya ilerleyebilirsiniz.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
