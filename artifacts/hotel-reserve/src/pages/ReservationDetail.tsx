import { useState } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { useReservationDetail, useCancelReservation } from '@/services/reservations';
import { useRooms } from '@/services/rooms';
import { getErrorMessage } from '@/lib/api';
import { ArrowLeft, Calendar, KeyRound, XCircle } from 'lucide-react';

export default function ReservationDetail() {
  const { auth } = useAuth();
  const [, params] = useRoute('/rezervasyonlarim/:id');
  const [, setLocation] = useLocation();
  const id = params?.id ? Number(params.id) : undefined;

  const { data: reservation, isLoading, isError } = useReservationDetail(auth ? id : undefined);
  const { data: rooms } = useRooms();
  const cancelReservation = useCancelReservation();
  const [error, setError] = useState<string | null>(null);

  if (!auth) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-serif text-primary mb-4">Giriş Yapmalısınız</h1>
        <Link href="/giris" className="bg-primary text-primary-foreground px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors">
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Yükleniyor...
      </div>
    );
  }

  if (isError || !reservation) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-serif text-primary mb-4">Rezervasyon Bulunamadı</h1>
        <Link href="/rezervasyonlarim" className="text-primary underline">Rezervasyonlarıma Dön</Link>
      </div>
    );
  }

  const room = rooms?.find((r) => r.id === reservation.room);
  const checkInDate = new Date(reservation.check_in);
  const isPast = checkInDate < new Date();
  const canCancel = reservation.status === 'active' && !isPast;
  const statusLabel =
    reservation.status === 'cancelled' ? 'İptal Edildi' :
    reservation.status === 'completed' ? 'Tamamlandı' :
    'Onaylandı';

  const handleRemove = async () => {
    const confirmText = canCancel
      ? 'Rezervasyonunuzu iptal etmek istediğinize emin misiniz?'
      : 'Bu rezervasyon kaydını kaldırmak istediğinize emin misiniz?';
    if (!confirm(confirmText)) return;

    setError(null);
    try {
      await cancelReservation.mutateAsync(reservation.id);
      setLocation('/rezervasyonlarim');
    } catch (err) {
      setError(getErrorMessage(err, 'İşlem gerçekleştirilemedi.'));
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl">
        <Link href="/rezervasyonlarim" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Rezervasyonlarıma Dön
        </Link>

        <div className="bg-card border border-border p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-border pb-6">
            <div>
              <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Rezervasyon No</span>
              <span className="text-2xl font-mono text-primary tracking-wider">#{reservation.id}</span>
            </div>
            <div className={`px-4 py-1.5 text-xs uppercase tracking-widest ${
              reservation.status === 'cancelled' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
              reservation.status === 'completed' ? 'bg-muted text-muted-foreground border border-border' :
              'bg-secondary/20 text-primary border border-secondary/50'
            }`}>
              {statusLabel}
            </div>
          </div>

          {room && (
            <div className="flex gap-6 mb-8">
              <div className="w-32 h-32 shrink-0 bg-muted hidden sm:block">
                <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-serif text-3xl text-primary mb-2">{room.name}</h1>
                <p className="text-sm text-muted-foreground">{room.shortDescription}</p>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-8 text-sm text-foreground/80 border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span>Konaklama Tarihleri</span>
              </div>
              <span className="font-medium text-foreground">
                {new Date(reservation.check_in).toLocaleDateString('tr-TR')} - {new Date(reservation.check_out).toLocaleDateString('tr-TR')}
              </span>
            </div>

            {reservation.status === 'active' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <KeyRound className="w-5 h-5 text-muted-foreground" />
                  <span>Anahtar Kodu</span>
                </div>
                <span className="font-mono font-medium text-foreground tracking-widest">{reservation.keybox_code}</span>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-destructive mb-6">{error}</p>}

          <button
            onClick={handleRemove}
            disabled={cancelReservation.isPending}
            className="flex items-center justify-center gap-2 w-full text-xs uppercase tracking-widest text-destructive hover:bg-destructive/5 py-3 border border-destructive/20 transition-colors disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            {cancelReservation.isPending ? 'İşleniyor...' : canCancel ? 'Rezervasyonu İptal Et' : 'Kaydı Kaldır'}
          </button>
        </div>
      </div>
    </div>
  );
}
