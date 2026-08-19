import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Amenity } from '@/data/mock';
import room1Img from '@assets/generated_images/room-1.jpg';
import room2Img from '@assets/generated_images/room-2.jpg';
import room3Img from '@assets/generated_images/room-3.jpg';
import room4Img from '@assets/generated_images/room-4.jpg';
import room5Img from '@assets/generated_images/room-5.jpg';
import room6Img from '@assets/generated_images/room-6.jpg';

const FALLBACK_IMAGES = [room1Img, room2Img, room3Img, room4Img, room5Img, room6Img];

function fallbackImage(id: number): string {
  return FALLBACK_IMAGES[(id - 1) % FALLBACK_IMAGES.length];
}

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface BackendRoomSummary {
  id: number;
  name: string;
  slug: string;
  room_number: number;
  room_type: string;
  price: string;
  capacity: number;
  short_description: string;
  size_sqm: number;
  image_url: string;
  is_active: boolean;
}

interface BackendRoomDetail extends BackendRoomSummary {
  description: string;
  bed_type: string;
  amenities: string[];
  gallery: string[];
}

export interface RoomSummary {
  id: number;
  name: string;
  slug: string;
  roomType: string;
  pricePerNight: number;
  capacity: number;
  shortDescription: string;
  sizeSqm: number;
  imageUrl: string;
  isActive: boolean;
}

export interface RoomDetail extends RoomSummary {
  description: string;
  bedType: string;
  amenities: Amenity[];
  gallery: string[];
}

const KNOWN_AMENITIES: Amenity[] = [
  'wifi', 'ac', 'minibar', 'tv', 'room_service', 'safe', 'bath', 'balcony', 'terrace', 'view',
];

function toRoomSummary(r: BackendRoomSummary): RoomSummary {
  return {
    id: r.id,
    name: r.name || `Oda ${r.room_number}`,
    slug: r.slug,
    roomType: r.room_type,
    pricePerNight: Number(r.price),
    capacity: r.capacity,
    shortDescription: r.short_description,
    sizeSqm: r.size_sqm,
    imageUrl: r.image_url || fallbackImage(r.id),
    isActive: r.is_active,
  };
}

function toRoomDetail(r: BackendRoomDetail): RoomDetail {
  return {
    ...toRoomSummary(r),
    description: r.description,
    bedType: r.bed_type,
    amenities: r.amenities.filter((a): a is Amenity => (KNOWN_AMENITIES as string[]).includes(a)),
    gallery: r.gallery.length > 0 ? r.gallery : [r.image_url || fallbackImage(r.id)],
  };
}

async function fetchAllRooms(): Promise<RoomSummary[]> {
  const rooms: BackendRoomSummary[] = [];
  let url: string | null = '/rooms/';
  while (url) {
    const page: Paginated<BackendRoomSummary> = await apiFetch(url);
    rooms.push(...page.results);
    url = page.next;
  }
  return rooms.filter((r) => r.is_active).map(toRoomSummary);
}

export function useRooms() {
  return useQuery({ queryKey: ['rooms'], queryFn: fetchAllRooms });
}

async function fetchRoomDetail(id: number): Promise<RoomDetail> {
  const raw = await apiFetch<BackendRoomDetail>(`/rooms/${id}/`);
  return toRoomDetail(raw);
}

export function useRoomDetail(id: number | undefined) {
  return useQuery({
    queryKey: ['room', id],
    queryFn: () => fetchRoomDetail(id as number),
    enabled: id !== undefined,
  });
}
