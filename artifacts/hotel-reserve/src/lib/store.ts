import { useState, useEffect } from 'react';
import { Room } from '@/data/mock';

export interface BookingDetails {
  id: string;
  roomId: string;
  checkIn: string; // ISO string
  checkOut: string; // ISO string
  guests: number;
  totalPrice: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  createdAt: string;
  status: 'confirmed' | 'cancelled';
}

const STORAGE_KEY = 'velaris_bookings';

export const getStoredBookings = (): BookingDetails[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error parsing bookings', e);
    return [];
  }
};

export const saveBooking = (booking: Omit<BookingDetails, 'id' | 'createdAt' | 'status'>): BookingDetails => {
  const bookings = getStoredBookings();
  const id = `VH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const newBooking: BookingDetails = {
    ...booking,
    id,
    createdAt: new Date().toISOString(),
    status: 'confirmed'
  };
  
  bookings.push(newBooking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  
  // Dispatch custom event for cross-tab or cross-component syncing
  window.dispatchEvent(new Event('velaris_bookings_updated'));
  
  return newBooking;
};

export const cancelBooking = (id: string) => {
  const bookings = getStoredBookings();
  const updated = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('velaris_bookings_updated'));
};

export function useBookings() {
  const [bookings, setBookings] = useState<BookingDetails[]>([]);

  useEffect(() => {
    const load = () => setBookings(getStoredBookings());
    load();
    
    window.addEventListener('velaris_bookings_updated', load);
    return () => window.removeEventListener('velaris_bookings_updated', load);
  }, []);

  return { bookings };
}
