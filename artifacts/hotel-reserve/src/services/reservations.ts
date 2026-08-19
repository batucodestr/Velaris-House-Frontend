import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Reservation {
  id: number;
  user: number;
  room: number;
  check_in: string;
  check_out: string;
  status: 'active' | 'completed' | 'cancelled';
  keybox_code: string;
}

async function fetchMyReservations(): Promise<Reservation[]> {
  const reservations: Reservation[] = [];
  let url: string | null = '/reservations/';
  while (url) {
    const page: Paginated<Reservation> = await apiFetch(url);
    reservations.push(...page.results);
    url = page.next;
  }
  return reservations;
}

export function useMyReservations(enabled: boolean) {
  return useQuery({ queryKey: ['reservations'], queryFn: fetchMyReservations, enabled });
}

async function fetchReservationDetail(id: number): Promise<Reservation> {
  return apiFetch<Reservation>(`/reservations/${id}/`);
}

export function useReservationDetail(id: number | undefined) {
  return useQuery({
    queryKey: ['reservation', id],
    queryFn: () => fetchReservationDetail(id as number),
    enabled: id !== undefined,
  });
}

export interface CreateReservationInput {
  room: number;
  check_in: string;
  check_out: string;
}

async function createReservation(input: CreateReservationInput): Promise<Reservation> {
  return apiFetch<Reservation>('/reservations/create/', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

async function cancelReservation(id: number): Promise<void> {
  await apiFetch(`/reservations/${id}/`, { method: 'DELETE' });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}
