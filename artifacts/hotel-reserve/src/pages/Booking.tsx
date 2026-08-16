import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ROOMS, Room, checkAvailability } from '@/data/mock';
import { saveBooking } from '@/lib/store';
import { Check, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

export default function Booking() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>(1);

  // Form State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  
  const [guestDetails, setGuestDetails] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // Initialize from URL params if available
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('room');
    if (roomId) {
      setSelectedRoomId(roomId);
    }
  }, []);

  const today = new Date().toISOString().split('T')[0];

  // Calculations
  const availableRooms = useMemo(() => {
    if (!checkIn || !checkOut) return ROOMS;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    
    return ROOMS.filter(room => {
      if (room.capacity < parseInt(guests)) return false;
      if (inDate < outDate) {
        return checkAvailability(room.id, inDate, outDate);
      }
      return true;
    });
  }, [checkIn, checkOut, guests]);

  const selectedRoom = ROOMS.find(r => r.id === selectedRoomId);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  const totalPrice = selectedRoom ? nights * selectedRoom.pricePerNight : 0;

  // Handlers
  const handleNext = () => {
    if (step === 1 && (!checkIn || !checkOut || checkIn >= checkOut)) {
      alert("Lütfen geçerli bir tarih aralığı seçiniz.");
      return;
    }
    if (step === 2 && !selectedRoomId) {
      alert("Lütfen bir oda seçiniz.");
      return;
    }
    if (step === 3 && (!guestDetails.name || !guestDetails.email || !guestDetails.phone)) {
      alert("Lütfen zorunlu alanları doldurunuz.");
      return;
    }
    if (step === 4) {
      // Confirm booking
      const booking = saveBooking({
        roomId: selectedRoomId!,
        checkIn,
        checkOut,
        guests: parseInt(guests),
        totalPrice,
        guestName: guestDetails.name,
        guestEmail: guestDetails.email,
        guestPhone: guestDetails.phone,
        specialRequests: guestDetails.specialRequests
      });
      setConfirmedBookingId(booking.id);
      return;
    }
    setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1) as Step);
  };

  if (confirmedBookingId) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="bg-card border border-border p-12 max-w-lg w-full text-center animate-in zoom-in-95 duration-700">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-serif text-primary mb-4">Rezervasyonunuz Onaylandı</h2>
          <p className="text-muted-foreground mb-8 text-balance">
            Sizi Velaris House'ta ağırlamaktan mutluluk duyacağız. Rezervasyon detaylarınız e-posta adresinize iletilmiştir.
          </p>
          <div className="bg-muted p-6 border border-border mb-8">
            <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Rezervasyon Kodu</span>
            <span className="text-2xl font-mono text-primary font-medium tracking-widest">{confirmedBookingId}</span>
          </div>
          <button 
            onClick={() => setLocation('/rezervasyonlarim')}
            className="bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors w-full"
          >
            Rezervasyonlarımı Görüntüle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        
        {/* Progress Bar */}
        <div className="mb-16">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border -z-10"></div>
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="bg-background px-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-colors ${
                  step > s ? 'bg-primary text-primary-foreground border-primary' : 
                  step === s ? 'border-primary text-primary' : 'border-border text-muted-foreground'
                }`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs uppercase tracking-widest text-muted-foreground">
            <span>Tarih</span>
            <span>Oda</span>
            <span>Bilgiler</span>
            <span>Onay</span>
          </div>
        </div>

        <div className="bg-card border border-border p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* STEP 1: Dates & Guests */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-2xl font-serif text-primary mb-8">Konaklama Tarihleri</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">Giriş Tarihi</label>
                  <input 
                    type="date" 
                    min={today}
                    value={checkIn}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (checkOut && e.target.value >= checkOut) setCheckOut('');
                    }}
                    className="w-full bg-transparent border-b border-border py-4 focus:outline-none focus:border-primary transition-colors text-foreground text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">Çıkış Tarihi</label>
                  <input 
                    type="date" 
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent border-b border-border py-4 focus:outline-none focus:border-primary transition-colors text-foreground text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2 max-w-xs">
                <label className="text-sm uppercase tracking-widest text-muted-foreground">Misafir Sayısı</label>
                <select 
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-transparent border-b border-border py-4 focus:outline-none focus:border-primary transition-colors text-foreground text-lg appearance-none"
                >
                  <option value="1">1 Yetişkin</option>
                  <option value="2">2 Yetişkin</option>
                  <option value="3">3 Yetişkin</option>
                  <option value="4">4 Yetişkin</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Room Selection */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-2xl font-serif text-primary mb-8">Oda Seçimi</h2>
              
              {availableRooms.length === 0 ? (
                <div className="text-center py-12 border border-border">
                  <p className="text-muted-foreground">Seçtiğiniz tarihlerde uygun oda bulunmamaktadır.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableRooms.map(room => (
                    <div 
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`border p-6 cursor-pointer transition-all duration-300 ${
                        selectedRoomId === room.id 
                          ? 'border-primary ring-1 ring-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50 bg-card'
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="w-24 h-24 shrink-0 bg-muted">
                          <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl text-primary mb-1">{room.name}</h3>
                          <div className="text-sm text-muted-foreground mb-4">Maks {room.capacity} Kişi • {room.sizeSqm} m²</div>
                          <div className="text-primary font-medium">{room.pricePerNight.toLocaleString('tr-TR')} ₺ / gece</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Guest Details */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-2xl font-serif text-primary mb-8">Misafir Bilgileri</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">İsim Soyisim</label>
                  <input 
                    type="text" 
                    value={guestDetails.name}
                    onChange={(e) => setGuestDetails({...guestDetails, name: e.target.value})}
                    className="w-full bg-transparent border-b border-border py-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                    placeholder="Kimliğinizdeki gibi giriniz"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">E-posta</label>
                  <input 
                    type="email" 
                    value={guestDetails.email}
                    onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})}
                    className="w-full bg-transparent border-b border-border py-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">Telefon</label>
                  <input 
                    type="tel" 
                    value={guestDetails.phone}
                    onChange={(e) => setGuestDetails({...guestDetails, phone: e.target.value})}
                    className="w-full bg-transparent border-b border-border py-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">Özel İstekler (Opsiyonel)</label>
                  <textarea 
                    value={guestDetails.specialRequests}
                    onChange={(e) => setGuestDetails({...guestDetails, specialRequests: e.target.value})}
                    rows={3}
                    className="w-full bg-transparent border-b border-border py-4 focus:outline-none focus:border-primary transition-colors text-foreground resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Summary */}
          {step === 4 && selectedRoom && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-2xl font-serif text-primary mb-8">Özet & Onay</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Konaklama Detayları</h3>
                    <div className="bg-muted p-6 border border-border">
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <span className="block text-xs text-muted-foreground mb-1">Giriş</span>
                          <span className="font-medium text-foreground">{new Date(checkIn).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-muted-foreground mb-1">Çıkış</span>
                          <span className="font-medium text-foreground">{new Date(checkOut).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-t border-border pt-4">
                        <span className="text-sm text-muted-foreground">{nights} Gece, {guests} Yetişkin</span>
                        <span className="font-serif text-primary">{selectedRoom.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">İletişim Bilgileri</h3>
                    <div className="space-y-2 text-sm text-foreground/80">
                      <p><span className="font-medium text-foreground">İsim:</span> {guestDetails.name}</p>
                      <p><span className="font-medium text-foreground">E-posta:</span> {guestDetails.email}</p>
                      <p><span className="font-medium text-foreground">Telefon:</span> {guestDetails.phone}</p>
                      {guestDetails.specialRequests && (
                        <p><span className="font-medium text-foreground">Not:</span> {guestDetails.specialRequests}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 p-8 border border-primary/20 flex flex-col h-full">
                  <h3 className="text-sm uppercase tracking-widest text-primary mb-6 border-b border-primary/20 pb-4">Fiyat Özeti</h3>
                  
                  <div className="space-y-4 mb-8 flex-1">
                    <div className="flex justify-between text-foreground/80">
                      <span>Oda Ücreti ({nights} gece)</span>
                      <span>{totalPrice.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <div className="flex justify-between text-foreground/80">
                      <span>Vergiler (%10 KDV)</span>
                      <span>Dahil</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-primary/20 pt-6 mt-auto">
                    <span className="text-lg font-serif text-primary">Toplam Tutar</span>
                    <span className="text-3xl font-serif text-primary">{totalPrice.toLocaleString('tr-TR')} ₺</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-border flex justify-between">
            {step > 1 ? (
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors px-4 py-2"
              >
                <ArrowLeft className="w-4 h-4" /> Geri
              </button>
            ) : (
              <div></div>
            )}
            
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
            >
              {step === 4 ? 'Rezervasyonu Tamamla' : 'Devam Et'}
              {step < 4 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
