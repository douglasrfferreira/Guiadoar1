export type DonationCategory = "clothes" | "food" | "toys" | "electronics" | "furniture" | "books";

export interface DonationPoint {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  hours: string;
  acceptedItems: DonationCategory[];
  distance?: number;
}
