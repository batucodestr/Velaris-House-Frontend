import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/lib/auth';
import { useMyReservations, useCancelReservation } from '@/services/reservations';
import { useRooms } from '@/services/rooms';
import { getErrorMessage } from '@/lib/api';
import { Calendar, XCircle, KeyRound, ChevronRight } from 'lucide-react';

export default function MyBookings() {
  const { auth } = useAuth();
  const { data: reservations, isLoading, isError } = useMyReservations(!!auth);
  const { data: rooms } = useRooms();
  const cancelReservation = useCancelReservation();
  const [actionError, setActionError] = useState<string | null>(null);

  if (!auth) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-serif text-primary mb-4">Giriş Yapmalısınız</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Rezervasyonlarınızı görüntülemek için hesabınıza giriş yapmanız gerekiyor.
        </p>
        <Link
          href="/giris"
          className="bg-primary text-primary-foreground px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Rezervasyonlar yükleniyor...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Rezervasyonlar yüklenemedi. Lütfen daha sonra tekrar deneyin.
      </div>
    );
  }

  if (!reservations || reservations.length === 0) {
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

  const handleRemove = async (id: number, canCancel: boolean) => {
    const confirmText = canCancel
      ? 'Rezervasyonunuzu iptal etmek istediğinize emin misiniz?'
      : 'Bu rezervasyon kaydını kaldırmak istediğinize emin misiniz?';
    if (!confirm(confirmText)) return;

    setActionError(null);
    try {
      await cancelReservation.mutateAsync(id);
    } catch (err) {
      setActionError(getErrorMessage(err, 'İşlem gerçekleştirilemedi.'));
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-4xl font-serif text-primary mb-4">Rezervasyonlarım</h1>
          <p className="text-muted-foreground">Geçmiş ve gelecek konaklamalarınız.</p>
        </div>

        {actionError && <p className="text-sm text-destructive mb-8">{actionError}</p>}

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          {reservations.map(reservation => {
            const room = rooms?.find(r => r.id === reservation.room);

            const isCancelled = reservation.status === 'cancelled';
            const isCompleted = reservation.status === 'completed';
            const checkInDate = new Date(reservation.check_in);
            const isPast = checkInDate < new Date();
            const canCancel = reservation.status === 'active' && !isPast;

            return (
              <div
                key={reservation.id}
                className={`bg-card border p-6 md:p-8 transition-colors ${
                  isCancelled ? 'border-border/50 opacity-75' : 'border-border'
                }`}
              >
                <Link href={`/rezervasyonlarim/${reservation.id}`} className="block group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-border pb-6">
                    <div>
                      <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Rezervasyon No</span>
                      <span className="text-xl font-mono text-primary tracking-wider group-hover:underline">#{reservation.id}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-1.5 text-xs uppercase tracking-widest ${
                        isCancelled ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                        isCompleted || isPast ? 'bg-muted text-muted-foreground border border-border' :
                        'bg-secondary/20 text-primary border border-secondary/50'
                      }`}>
                        {isCancelled ? 'İptal Edildi' : isCompleted ? 'Tamamlandı' : isPast ? 'Geçmiş' : 'Onaylandı'}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  <div className="flex gap-6">
                    {room && (
                      <div className="w-24 h-24 shrink-0 bg-muted hidden sm:block">
                        <img src={room.imageUrl} alt={room.name} className={`w-full h-full object-cover ${isCancelled ? 'grayscale' : ''}`} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif text-2xl text-primary mb-2">{room?.name ?? `Oda #${reservation.room}`}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(reservation.check_in).toLocaleDateString('tr-TR')} - {new Date(reservation.check_out).toLocaleDateString('tr-TR')}
                      </div>
                      {reservation.status === 'active' && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <KeyRound className="w-4 h-4" />
                          Anahtar Kodu: {reservation.keybox_code}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => handleRemove(reservation.id, canCancel)}
                  disabled={cancelReservation.isPending}
                  className="flex items-center justify-center gap-2 w-full mt-6 text-xs uppercase tracking-widest text-destructive hover:bg-destructive/5 py-2 border border-destructive/20 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" /> {canCancel ? 'İptal Et' : 'Kaldır'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
