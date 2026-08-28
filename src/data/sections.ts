export const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'Identity' },
  { id: 'problem', label: 'Problem' },
  { id: 'mission', label: 'Mission' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'services', label: 'Services' },
  { id: 'promise', label: 'Promise' },
  { id: 'contact', label: 'Contact' },
] as const;

export type SectionId = (typeof sections)[number]['id'];
