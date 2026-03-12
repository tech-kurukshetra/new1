export type PricingMode = 'fixed' | 'per_person' | 'per_person_or_team';

export interface EventConfig {
  id: string;
  name: string;
  category: 'TECH' | 'ESPORTS' | 'NON-TECH' | 'PERFORMANCES';
  price: number;          // base price (solo / team flat rate)
  pricePerPerson?: number; // if per-person pricing exists alongside team
  teamPrice?: number;      // team price when per-person also offered
  minTeam: number;         // 1 = solo
  maxTeam: number;
  pricingNote: string;    // human-readable price label shown in UI
  requiresTeamName: boolean;
}

export const EVENTS: EventConfig[] = [
  // ── TECH ──────────────────────────────────────────────────────────────────
  {
    id: 'hackathon',
    name: 'Hackathon',
    category: 'TECH',
    price: 600,
    minTeam: 2,
    maxTeam: 5,
    pricingNote: '₹600 / team (up to 5 members)',
    requiresTeamName: true,
  },
  {
    id: 'project-showcase',
    name: 'Project Showcase',
    category: 'TECH',
    price: 150,
    pricePerPerson: 150,
    teamPrice: 300,
    minTeam: 1,
    maxTeam: 2,
    pricingNote: '₹150 / person  ·  ₹300 / team (2 members)',
    requiresTeamName: false,
  },
  {
    id: 'workshop-aiml',
    name: 'Workshop – AI/ML',
    category: 'TECH',
    price: 100,
    minTeam: 1,
    maxTeam: 1,
    pricingNote: '₹100 / person',
    requiresTeamName: false,
  },
  {
    id: 'workshop-cyber',
    name: 'Workshop – Cyber Security',
    category: 'TECH',
    price: 100,
    minTeam: 1,
    maxTeam: 1,
    pricingNote: '₹100 / person',
    requiresTeamName: false,
  },
  {
    id: 'workshop-uiux',
    name: 'Workshop – UI/UX & Web Dev',
    category: 'TECH',
    price: 100,
    minTeam: 1,
    maxTeam: 1,
    pricingNote: '₹100 / person',
    requiresTeamName: false,
  },
  {
    id: 'code-sprint',
    name: 'Code Sprint',
    category: 'TECH',
    price: 200,
    minTeam: 1,
    maxTeam: 1,
    pricingNote: '₹200 / person',
    requiresTeamName: false,
  },
  {
    id: 'algorithm-relay',
    name: 'Algorithm Relay',
    category: 'TECH',
    price: 100,
    minTeam: 1,
    maxTeam: 1,
    pricingNote: '₹100 / person',
    requiresTeamName: false,
  },
  {
    id: 'digital-forensic-hunt',
    name: 'Digital Forensic Hunt',
    category: 'TECH',
    price: 100,
    minTeam: 1,
    maxTeam: 1,
    pricingNote: '₹100 / person',
    requiresTeamName: false,
  },

  // ── E-SPORTS ──────────────────────────────────────────────────────────────
  {
    id: 'bgmi',
    name: 'BGMI',
    category: 'ESPORTS',
    price: 400,
    minTeam: 2,
    maxTeam: 4,
    pricingNote: '₹400 / team',
    requiresTeamName: true,
  },
  {
    id: 'free-fire',
    name: 'Free Fire',
    category: 'ESPORTS',
    price: 400,
    minTeam: 2,
    maxTeam: 4,
    pricingNote: '₹400 / team',
    requiresTeamName: true,
  },
  {
    id: 'mini-militia',
    name: 'Mini Militia',
    category: 'ESPORTS',
    price: 50,
    pricePerPerson: 50,
    teamPrice: 400,
    minTeam: 1,
    maxTeam: 8,
    pricingNote: '₹50 / person  ·  ₹400 / full team',
    requiresTeamName: false,
  },

  // ── NON-TECH ──────────────────────────────────────────────────────────────
  {
    id: 'volleyball',
    name: 'Volleyball',
    category: 'NON-TECH',
    price: 700,
    minTeam: 6,
    maxTeam: 12,
    pricingNote: '₹700 / team',
    requiresTeamName: true,
  },
  {
    id: 'relay-race',
    name: 'Relay Race',
    category: 'NON-TECH',
    price: 200,
    minTeam: 2,
    maxTeam: 3,
    pricingNote: '₹200 / team (2–3 members)',
    requiresTeamName: true,
  },
  {
    id: 'treasure-hunt',
    name: 'Treasure Hunt',
    category: 'NON-TECH',
    price: 80,
    minTeam: 1,
    maxTeam: 1,
    pricingNote: '₹80 / person',
    requiresTeamName: false,
  },
  {
    id: 'quiz',
    name: 'Quiz',
    category: 'NON-TECH',
    price: 50,
    minTeam: 1,
    maxTeam: 1,
    pricingNote: '₹50 / person',
    requiresTeamName: false,
  },
  {
    id: 'debate',
    name: 'Debate',
    category: 'NON-TECH',
    price: 200,
    minTeam: 4,
    maxTeam: 4,
    pricingNote: '₹200 / team (4 members)',
    requiresTeamName: true,
  },

  // ── PERFORMANCES ──────────────────────────────────────────────────────────
  {
    id: 'ramp-walk',
    name: 'Ramp Walk',
    category: 'PERFORMANCES',
    price: 700,
    minTeam: 1,
    maxTeam: 1,
    pricingNote: '₹700 / person',
    requiresTeamName: false,
  },
  {
    id: 'dance',
    name: 'Dance (Solo / Team)',
    category: 'PERFORMANCES',
    price: 75,
    minTeam: 1,
    maxTeam: 10,
    pricingNote: '₹75 / person',
    requiresTeamName: false,
  },
  {
    id: 'dj-orchestra',
    name: 'DJ / Orchestra',
    category: 'PERFORMANCES',
    price: 250,
    minTeam: 1,
    maxTeam: 1,
    pricingNote: '₹250 / person',
    requiresTeamName: false,
  },
];

export const CATEGORIES = [
  { id: 'TECH', label: 'Tech Events', color: 'text-primary' },
  { id: 'ESPORTS', label: 'E-Sports', color: 'text-accent' },
  { id: 'NON-TECH', label: 'Non-Tech Events', color: 'text-emerald-400' },
  { id: 'PERFORMANCES', label: 'Performances', color: 'text-pink-400' },
] as const;

/** Calculate how much the leader needs to pay based on selected event + team size */
export function calculateAmount(event: EventConfig, memberCount: number): number {
  const totalPeople = memberCount + 1; // +1 for leader

  // Per-person mode (solo events or per-person pricing)
  if (event.maxTeam === 1) return event.price;

  // Mixed pricing: per-person OR flat team price (e.g. Mini Militia, Project Showcase)
  if (event.pricePerPerson && event.teamPrice) {
    // If filling the max team, charge flat team rate — else per-person
    if (totalPeople >= event.maxTeam) return event.teamPrice;
    return event.pricePerPerson * totalPeople;
  }

  // Flat team price
  return event.price;
}
