export type Amenity = 'wifi' | 'ac' | 'minibar' | 'tv' | 'room_service' | 'safe' | 'bath' | 'balcony' | 'terrace' | 'view';

export const AMENITY_LABELS: Record<Amenity, string> = {
  wifi: 'Ücretsiz Wi-Fi',
  ac: 'Klima',
  minibar: 'Minibar',
  tv: 'Akıllı TV',
  room_service: 'Oda Servisi',
  safe: 'Kasa',
  bath: 'Küvet',
  balcony: 'Balkon',
  terrace: 'Teras',
  view: 'Manzara'
};
