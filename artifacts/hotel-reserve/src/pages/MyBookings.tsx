import { useBookings, cancelBooking } from '@/lib/store';
import { ROOMS } from '@/data/mock';
import { Link } from 'wouter';
import { Calendar, User, CreditCard, XCircle } from 'lucide-react';

export default function MyBookings() {
  const { bookings } = useBookings();

  if (bookings.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-serif text-primary mb-4">Rezervasyonunuz Bulunmuyor</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Henüz Velaris House'ta bir konaklama planlamadınız. Sizi ağırlamaktan mutluluk duyarız.
        </p>
        <Link 
          href="/odalar" 
          className="bg-primary text-primary-foreground px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          Odaları İncele
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-4xl font-serif text-primary mb-4">Rezervasyonlarım</h1>
          <p className="text-muted-foreground">Geçmiş ve gelecek konaklamalarınız.</p>
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          {/* Sorting bookings: newest first */}
          {[...bookings].reverse().map(booking => {
            const room = ROOMS.find(r => r.id === booking.roomId);
            if (!room) return null;
            
            const isCancelled = booking.status === 'cancelled';
            const checkInDate = new Date(booking.checkIn);
            const isPast = checkInDate < new Date();
            const canCancel = !isCancelled && !isPast;

            return (
              <div 
                key={booking.id} 
                className={`bg-card border p-6 md:p-8 transition-colors ${
                  isCancelled ? 'border-border/50 opacity-75' : 'border-border'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-border pb-6">
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Rezervasyon Kodu</span>
                    <span className="text-xl font-mono text-primary tracking-wider">{booking.id}</span>
                  </div>
                  <div className={`px-4 py-1.5 text-xs uppercase tracking-widest ${
                    isCancelled ? 'bg-destructive/10 text-destructive border border-destructive/20' : 
                    isPast ? 'bg-muted text-muted-foreground border border-border' : 
                    'bg-secondary/20 text-primary border border-secondary/50'
                  }`}>
                    {isCancelled ? 'İptal Edildi' : isPast ? 'Geçmiş' : 'Onaylandı'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="md:col-span-2 flex gap-6">
                    <div className="w-24 h-24 shrink-0 bg-muted hidden sm:block">
                      <img src={room.imageUrl} alt={room.name} className={`w-full h-full object-cover ${isCancelled ? 'grayscale' : ''}`} />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl text-primary mb-2">{room.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.checkIn).toLocaleDateString('tr-TR')} - {new Date(booking.checkOut).toLocaleDateString('tr-TR')}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        {booking.guests} Yetişkin
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Misafir</span>
                    <div className="text-sm text-foreground/80">
                      <p>{booking.guestName}</p>
                      <p>{booking.guestEmail}</p>
                      <p>{booking.guestPhone}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-between">
                    <div>
                      <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Toplam Tutar</span>
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        {booking.totalPrice.toLocaleString('tr-TR')} ₺
                      </div>
                    </div>
                    
                    {canCancel && (
                      <button 
                        onClick={() => {
                          if(confirm('Rezervasyonunuzu iptal etmek istediğinize emin misiniz?')) {
                            cancelBooking(booking.id);
                          }
                        }}
                        className="flex items-center justify-center gap-2 mt-6 md:mt-0 w-full text-xs uppercase tracking-widest text-destructive hover:bg-destructive/5 py-2 border border-destructive/20 transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> İptal Et
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
