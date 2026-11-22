export interface M4Color {
  id: string;
  name: string;
  hex: string;
  imageUrl: string;
  desc: string;
  price: string;
  glowColor: string; // Tailwind glow or drop-shadow color for the backdrop
}

export interface SpecItem {
  label: string;
  value: string;
  unit: string;
}

export type ViewMode = 'exterior' | 'performance' | 'cockpit';
