// Patreon tiers. Source of truth for the membership section copy.
// Update prices and perks here, not in the component.
//
// IMPORTANT: keep perks aligned with the live Patreon at members.currentheading.com.
// If the Patreon perks change, update this file in the same PR.

export interface Tier {
  id: string;
  name: string;
  /** Monthly price in USD, no symbol. */
  price: string;
  featured?: boolean;
  perks: string[];
}

export const TIERS: Tier[] = [
  {
    id: "T-01",
    name: "Day-trip",
    price: "10",
    perks: [
      "Access to The Charging Hangar Discord",
      "Early-cut posts before YouTube",
      "Patron-only sticker pack, mailed",
    ],
  },
  {
    id: "T-02",
    name: "Cross-country",
    price: "20",
    featured: true,
    perks: [
      "Everything in Day-trip",
      "Monthly live Q&A in The Charging Hangar",
      "Behind-the-scenes production notes",
      "First crack at road-trip route votes",
    ],
  },
  {
    id: "T-03",
    name: "Long-haul",
    price: "40",
    perks: [
      "Everything in Cross-country",
      "Quarterly Zoom hangout, max 12 patrons",
      "Name in the channel credits, forever",
      "Vote on the next op-ed teardown",
    ],
  },
];
