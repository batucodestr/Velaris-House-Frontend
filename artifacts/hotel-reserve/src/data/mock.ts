import { z } from 'zod';
import room1Img from '@assets/generated_images/room-1.jpg';
import room2Img from '@assets/generated_images/room-2.jpg';
import room3Img from '@assets/generated_images/room-3.jpg';
import room4Img from '@assets/generated_images/room-4.jpg';
import room5Img from '@assets/generated_images/room-5.jpg';
import room6Img from '@assets/generated_images/room-6.jpg';

export type Amenity = 'wifi' | 'ac' | 'minibar' | 'tv' | 'room_service' | 'safe' | 'bath' | 'balcony' | 'terrace' | 'view';

export interface Room {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  capacity: number;
  pricePerNight: number;
  sizeSqm: number;
  bedType: string;
  amenities: Amenity[];
  imageUrl: string;
  gallery: string[];
}

export const ROOMS: Room[] = [
  {
    id: '1',
    name: 'Suit 01',
    slug: 'suit-01',
    shortDescription: 'Özel tasarım ahşap paneller, geniş pencereler ve saf keten dokunuşlar.',
    description: 'En ince detayına kadar düşünülmüş Suit 01, geniş yaşam alanı ve özel tasarım mobilyalarıyla Velaris House deneyiminin zirvesini sunar. Ahşap panellerin sıcaklığı ve saf keten çarşafların rahatlığıyla zamanın yavaşladığını hissedeceksiniz.',
    capacity: 2,
    pricePerNight: 4500,
    sizeSqm: 45,
    bedType: 'King Size',
    amenities: ['wifi', 'ac', 'minibar', 'room_service', 'safe', 'bath'],
    imageUrl: room1Img,
    gallery: [
      room1Img
    ]
  },
  {
    id: '2',
    name: 'Avlu Oda',
    slug: 'avlu-oda',
    shortDescription: 'İç avlunun dinginliğine açılan, huzur dolu bir sığınak.',
    description: 'Tarihi yapının kalbindeki iç avluya bakan bu oda, günün her saati farklı bir ışık oyununa sahne olur. Şehrin gürültüsünden uzak, tamamen sessizlik ve huzur arayan misafirlerimiz için idealdir.',
    capacity: 2,
    pricePerNight: 2800,
    sizeSqm: 28,
    bedType: 'Queen Size',
    amenities: ['wifi', 'ac', 'minibar', 'safe', 'view'],
    imageUrl: room2Img,
    gallery: [
      room2Img
    ]
  },
  {
    id: '3',
    name: 'Teraslı Suit',
    slug: 'terasli-suit',
    shortDescription: 'Özel terasınızda akşam üstü kahvenizi yudumlayacağınız benzersiz bir alan.',
    description: 'Kendinize ait özel terasıyla öne çıkan bu suit, iç mekanın lüksünü dış mekanın ferahlığıyla birleştirir. Gün batımında terasınızda zaman geçirmek, Velaris House deneyiminin vazgeçilmez bir parçasıdır.',
    capacity: 3,
    pricePerNight: 5500,
    sizeSqm: 55,
    bedType: 'King Size + Sofa',
    amenities: ['wifi', 'ac', 'minibar', 'room_service', 'safe', 'bath', 'terrace', 'view'],
    imageUrl: room3Img,
    gallery: [
      room3Img
    ]
  },
  {
    id: '4',
    name: 'Klasik Oda',
    slug: 'klasik-oda',
    shortDescription: 'Yüksek tavanlar, kadife detaylar ve zamansız bir zarafet.',
    description: 'Tarihi binanın orijinal dokusunu en iyi yansıtan Klasik Oda, yüksek tavanları ve özenle seçilmiş antika detaylarıyla misafirlerini geçmişe doğru şık bir yolculuğa çıkarır.',
    capacity: 2,
    pricePerNight: 3200,
    sizeSqm: 32,
    bedType: 'Queen Size',
    amenities: ['wifi', 'ac', 'minibar', 'safe', 'tv'],
    imageUrl: room4Img,
    gallery: [
      room4Img
    ]
  },
  {
    id: '5',
    name: 'Çatı Katı',
    slug: 'cati-kati',
    shortDescription: 'Açık ahşap kirişlerin altında samimi, sıcak ve romantik bir atmosfer.',
    description: 'Evin en üst katında, eğimli tavanı ve orijinal ahşap kirişleriyle Çatı Katı odası, sıcak ve koza gibi saran bir atmosfere sahiptir. Romantik kaçamaklar için en çok tercih edilen odamızdır.',
    capacity: 2,
    pricePerNight: 3500,
    sizeSqm: 35,
    bedType: 'King Size',
    amenities: ['wifi', 'ac', 'minibar', 'safe', 'bath', 'view'],
    imageUrl: room5Img,
    gallery: [
      room5Img
    ]
  },
  {
    id: '6',
    name: 'Geniş Suit',
    slug: 'genis-suit',
    shortDescription: 'Büyük pencerelerden süzülen ışık ve rakipsiz bir ferahlık hissi.',
    description: 'Geniş aileler veya ekstra alana ihtiyaç duyan misafirlerimiz için tasarlanmış Geniş Suit, oturma ve yatak bölümlerinin akıcı bir şekilde birleştiği, ferah ve aydınlık bir yaşam alanı sunar.',
    capacity: 4,
    pricePerNight: 6200,
    sizeSqm: 65,
    bedType: 'King Size + 2 Single Beds',
    amenities: ['wifi', 'ac', 'minibar', 'room_service', 'safe', 'bath', 'tv', 'view'],
    imageUrl: room6Img,
    gallery: [
      room6Img
    ]
  }
];

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

// Mock Availability Logic
// Returns true if room is available on given dates (just a mock logic)
export const checkAvailability = (roomId: string, checkIn: Date, checkOut: Date): boolean => {
  if (checkIn >= checkOut) return false;
  
  // Deterministic mock: room 1 is always booked on 15th-20th of any month.
  const startDay = checkIn.getDate();
  const endDay = checkOut.getDate();
  
  // Just some arbitrary logic so we have occasional unavailability
  if (roomId === '1' && (startDay >= 15 && startDay <= 20)) return false;
  if (roomId === '3' && startDay % 2 === 0 && endDay - startDay > 3) return false;
  
  return true;
};
