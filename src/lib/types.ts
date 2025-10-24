
export type DonationCategory = string;

export interface DonationPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  hours: string;
  acceptedItems: DonationCategory[];
  distance?: number;
}
