
export type Event = {
  slug: string;
  title: string;
  isTechnical: boolean;
  category: string;
  description: string;
  longDescription: string;
  imgId: string;
  iconName: string;
  color: string;
  prize: string;
  rules: string[];
};

export type Sponsor = {
  id: string;
  name: string;
  logoUrl: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
};

export type Registration = {
  id: string;
  name: string;
  email: string;
  college: string;
  events: string[];
  registeredAt: Date;
};
