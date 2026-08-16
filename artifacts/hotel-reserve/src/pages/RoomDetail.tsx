import { useState } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { ROOMS, AMENITY_LABELS } from '@/data/mock';
import { Users, Maximize, Bed, Check } from 'lucide-react';

export default function RoomDetail() {
  const [, params] = useRoute('/odalar/:slug');
  const [, setLocation] = useLocation();
  const room = ROOMS.find(r => r.slug === params?.slug);
  const [activeImage, setActiveImage] = useState(0);

  if (!room) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center text-center px-6">
        <h1 className="text-4xl font-serif text-primary mb-4">Oda Bulunamadı</h1>
        <p className="text-muted-foreground mb-8">Aradığınız oda mevcut değil veya kaldırılmış olabilir.</p>
        <Link href="/odalar" className="text-primary underline">Odalarımıza Dön</Link>
      </div>
    );
  }

  const handleBooking = () => {
    setLocation(`/rezervasyon?room=${room.id}`);
  };

  return (
    <div className="pt-24 pb-24 min-h-screen bg-background">
      {/* Gallery Header */}
      <div className="relative h-[60vh] min-h-[400px] w-full bg-primary mb-16 animate-in fade-in duration-1000">
        <img 
          src={room.gallery[activeImage] || room.imageUrl} 
          alt={room.name} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="container mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif text-primary-foreground mb-4">{room.name}</h1>
            <p className="text-primary-foreground/80 max-w-2xl text-lg">{room.shortDescription}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-6 border-b border-border pb-4">Oda Detayları</h2>
              <p className="text-lg text-foreground leading-relaxed font-light">
                {room.description}
              </p>
            </section>
            
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-6 border-b border-border pb-4">Özellikler</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {room.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-3 text-foreground/80">
                    <Check className="w-4 h-4 text-secondary-foreground" />
                    <span>{AMENITY_LABELS[amenity]}</span>
                  </div>
                ))}
              </div>
            </section>
            
          </div>

          {/* Sidebar / Booking Card */}
          <div className="animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 fill-mode-both">
            <div className="bg-card border border-border p-8 sticky top-32">
              <div className="mb-8 border-b border-border pb-8">
                <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Gecelik Başlayan Fiyatlar</span>
                <div className="text-4xl font-serif text-primary">
                  {room.pricePerNight.toLocaleString('tr-TR')} ₺
                </div>
              </div>
              
              <div className="space-y-6 mb-8 text-sm text-foreground/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span>Kapasite</span>
                  </div>
                  <span className="font-medium">{room.capacity} Kişi</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Maximize className="w-5 h-5 text-muted-foreground" />
                    <span>Genişlik</span>
                  </div>
                  <span className="font-medium">{room.sizeSqm} m²</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bed className="w-5 h-5 text-muted-foreground" />
                    <span>Yatak</span>
                  </div>
                  <span className="font-medium">{room.bedType}</span>
                </div>
              </div>
              
              <button 
                onClick={handleBooking}
                className="w-full bg-primary text-primary-foreground py-4 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
              >
                Rezervasyon Yap
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
