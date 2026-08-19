import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { useRooms } from '@/services/rooms';
import { Users } from 'lucide-react';

export default function Rooms() {
  const { data: rooms, isLoading, isError } = useRooms();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  const filteredRooms = useMemo(() => {
    if (!rooms) return [];
    return rooms.filter((room) => room.capacity >= parseInt(guests));
  }, [rooms, guests]);

  // Prevent past dates
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Odalarımız</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Her biri farklı bir hikaye anlatan, özenle tasarlanmış odalarımızda sakinliğin ve lüksün tadını çıkarın.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-card p-6 border border-border mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="w-full md:w-1/3">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Giriş Tarihi</label>
              <div className="relative">
                <input
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary text-foreground"
                />
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Çıkış Tarihi</label>
              <div className="relative">
                <input
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary text-foreground"
                />
              </div>
            </div>

            <div className="w-full md:w-1/4">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Misafir</label>
              <div className="relative">
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary text-foreground appearance-none"
                >
                  <option value="1">1 Yetişkin</option>
                  <option value="2">2 Yetişkin</option>
                  <option value="3">3 Yetişkin</option>
                  <option value="4">4 Yetişkin</option>
                </select>
                <Users className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
          {checkIn && checkOut && (
            <p className="text-xs text-muted-foreground mt-4">
              Müsaitlik nihai olarak rezervasyon adımında teyit edilir.
            </p>
          )}
        </div>

        {/* Room List */}
        {isLoading ? (
          <div className="text-center py-24 text-muted-foreground">Odalar yükleniyor...</div>
        ) : isError ? (
          <div className="text-center py-24 bg-card border border-border">
            <h3 className="text-2xl font-serif text-primary mb-4">Odalar Yüklenemedi</h3>
            <p className="text-muted-foreground">Sunucuya ulaşılamıyor. Lütfen daha sonra tekrar deneyin.</p>
          </div>
        ) : (
          <div className="space-y-24">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room, index) => (
                <div
                  key={room.id}
                  className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center animate-in fade-in duration-1000 fill-mode-both`}
                  style={{ animationDelay: `${(index % 3) * 150}ms` }}
                >
                  <div className="w-full md:w-1/2">
                    <div className="relative aspect-[4/3] overflow-hidden group">
                      <img
                        src={room.imageUrl}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 px-0 md:px-8">
                    <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">{room.name}</h2>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                      {room.shortDescription}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-10 text-sm text-foreground/80">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{room.capacity} Kişilik</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs uppercase tracking-widest">Genişlik:</span>
                        <span>{room.sizeSqm} m²</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-8 mt-auto">
                      <div>
                        <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Gecelik</span>
                        <span className="text-2xl font-serif text-primary">{room.pricePerNight.toLocaleString('tr-TR')} ₺</span>
                      </div>
                      <Link
                        href={`/odalar/${room.slug}`}
                        className="bg-primary text-primary-foreground px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
                      >
                        İncele
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-card border border-border">
                <h3 className="text-2xl font-serif text-primary mb-4">Uygun Oda Bulunamadı</h3>
                <p className="text-muted-foreground">
                  Seçtiğiniz misafir sayısı için uygun odamız bulunmuyor. Lütfen farklı bir seçim deneyiniz.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
