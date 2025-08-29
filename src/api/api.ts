import axios from 'axios';
import { API_KEY, BASE_URL } from '../config/apiConfig';

export type EventItem = {
  id: string;
  title: string;
  image: string | null;
  venue: string;
  date: string;
  time: string;
};

export type PagedResult = {
  items: EventItem[];
  page: number;
  totalPages: number;
};

async function request(params: Record<string, any>) {
  const url = `${BASE_URL}/events.json`;
  const res = await axios.get(url, { params: { apikey: API_KEY, size: 20, ...params } });
  return res.data;
}

export async function fetchEventsPaged(query: string, page: number = 0): Promise<PagedResult> {
  try {
    let data = await request({ keyword: query || '', page });
    let events = data._embedded?.events ?? [];
    if ((events.length === 0) && query) {
      data = await request({ city: query, page });
      events = data._embedded?.events ?? [];
    }

    const normalized: EventItem[] = events.map((e: any) => ({
      id: e.id,
      title: e.name,
      image: e.images?.[0]?.url || null,
      venue: e._embedded?.venues?.[0]?.name || '—',
      date: e.dates?.start?.localDate || '',
      time: e.dates?.start?.localTime || '',
    }));

    const p = data.page || { number: page, totalPages: page + (normalized.length ? 1 : 0) };
    const totalPages = (p.totalPages ?? p.total ?? 1);
    const number = (typeof p.number === 'number' ? p.number : page);
    return { items: normalized, page: number, totalPages };
  } catch (e) {
    console.error('fetchEventsPaged error', e);
    return { items: [], page, totalPages: page };
  }
}

export async function fetchEventById(id: string) {
  const url = `${BASE_URL}/events/${id}.json`;
  const res = await axios.get(url, { params: { apikey: API_KEY } });
  return res.data;
}
