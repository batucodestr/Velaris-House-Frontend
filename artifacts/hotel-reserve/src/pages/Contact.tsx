import { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">İletişim</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Size nasıl yardımcı olabileceğimizi dinlemek için buradayız. Özel talepleriniz veya rezervasyon sorularınız için bize ulaşın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="animate-in fade-in slide-in-from-left-8 duration-1000 delay-300 fill-mode-both">
            <div className="prose prose-stone">
              <h3 className="text-2xl font-serif text-primary mb-8">Velaris House</h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Adres</h4>
                  <p className="text-lg text-foreground">Meşrutiyet Caddesi No: 15<br/>Beyoğlu, İstanbul<br/>34430 Türkiye</p>
                </div>
                
                <div>
                  <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-2">İletişim Bilgileri</h4>
                  <p className="text-lg text-foreground mb-1">+90 (212) 555 01 23</p>
                  <p className="text-lg text-foreground">info@velarishouse.com</p>
                </div>
                
                <div>
                  <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Ulaşım</h4>
                  <p className="text-foreground leading-relaxed">
                    Havalimanından özel transfer hizmetimiz bulunmaktadır. Rezervasyonunuzu tamamladıktan sonra transfer talebinizi iletebilirsiniz. Otelimiz, şehrin kalbinde olup toplu taşımaya yürüme mesafesindedir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 fill-mode-both">
            <div className="bg-card p-8 md:p-10 border border-border">
              <h3 className="text-2xl font-serif text-primary mb-8">Mesaj Gönderin</h3>
              
              {sent ? (
                <div className="bg-muted p-8 text-center border border-border">
                  <p className="text-primary text-lg font-serif mb-2">Mesajınız alınmıştır.</p>
                  <p className="text-muted-foreground text-sm">En kısa sürede size dönüş yapacağız. Teşekkür ederiz.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm uppercase tracking-widest text-muted-foreground">İsim Soyisim</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      className="w-full bg-transparent border-b border-border py-3 px-0 focus:outline-none focus:border-primary transition-colors text-foreground"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm uppercase tracking-widest text-muted-foreground">E-posta</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="w-full bg-transparent border-b border-border py-3 px-0 focus:outline-none focus:border-primary transition-colors text-foreground"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm uppercase tracking-widest text-muted-foreground">Mesajınız</label>
                    <textarea 
                      id="message" 
                      required
                      rows={4}
                      className="w-full bg-transparent border-b border-border py-3 px-0 focus:outline-none focus:border-primary transition-colors text-foreground resize-none"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-4 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors mt-4"
                  >
                    Gönder
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
