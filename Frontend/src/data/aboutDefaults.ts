// Shared defaults for About page timeline and gallery
// Types
export type TimelineStop = { year: string; title: string; description: string; icon: string }
export type PastEvent = { id: number; title: string; type: 'photo'|'video'; thumbnail: string }

// Default timeline stops
export const defaultTimelineStops: TimelineStop[] = [
  {
    year: '1950',
    title: 'Formation of CREA',
    description:
      'The Central Railway Engineers Association was established to unite engineering professionals and advocate for their rights and welfare.',
    icon: '🚂',
  },
  {
    year: '1975',
    title: 'Major Expansion & First All-India Convention',
    description:
      'CREA expanded its reach across all divisions, hosting the first All-India Convention bringing together engineers nationwide.',
    icon: '🎯',
  },
  {
    year: '2000',
    title: 'Digitalization Initiative & Online Resource Launch',
    description:
      'Embracing technology, CREA launched its digital platform providing online resources and communication tools for members.',
    icon: '💻',
  },
  {
    year: '2020',
    title: 'Centenary Celebrations & New Welfare Programs',
    description:
      'Marking decades of service, CREA introduced enhanced welfare programs and expanded member benefits significantly.',
    icon: '🎊',
  },
]

// Default past events for gallery
export const defaultPastEvents: PastEvent[] = [
  { id: 1, title: 'Annual Technical Seminar 2024', type: 'photo', thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400' },
  { id: 2, title: 'Safety Workshop Mumbai Division', type: 'photo', thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400' },
  { id: 3, title: 'Railway Modernization Conference', type: 'video', thumbnail: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=400' },
  { id: 4, title: 'Member Felicitation Ceremony', type: 'photo', thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400' },
  { id: 5, title: 'High-Speed Rail Discussion Panel', type: 'video', thumbnail: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=400' },
  { id: 6, title: 'Engineers Day Celebration 2024', type: 'photo', thumbnail: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400' },
]
