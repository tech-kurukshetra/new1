
export type Event = {
  slug: string;
  name: string;
  isTechnical: boolean;
  category: string;
  description: string;
  longDescription: string;
  imgId: string;
  iconName: string;
  color: string;
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

    