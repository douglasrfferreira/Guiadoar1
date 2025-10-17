import type { DonationPoint } from './types';

let donationPoints: DonationPoint[] = [
  {
    id: 1,
    name: "Exército de Salvação",
    address: "R. Jaguaribe, 321 - Vila Nova, Londrina - PR, 86025-450",
    lat: -23.3033,
    lng: -51.1561,
    hours: "Seg-Sex: 9h-17h",
    acceptedItems: ["clothes", "furniture", "electronics", "books", "toys"],
  },
  {
    id: 2,
    name: "Cáritas Arquidiocesana de Londrina",
    address: "R. Dom Bosco, 145 - Jardim Dom Bosco, Londrina - PR, 86060-340",
    lat: -23.3134,
    lng: -51.1793,
    hours: "Seg-Sex: 8h-18h",
    acceptedItems: ["clothes", "food", "toys"],
  },
  {
    id: 3,
    name: "Guarda Mirim de Londrina",
    address: "R. Orestes Medeiros Pullin, 63 - Jardimশনে, Londrina - PR, 86072-030",
    lat: -23.2979,
    lng: -51.1872,
    hours: "Seg-Sex: 8h-17h",
    acceptedItems: ["books", "electronics"],
  },
  {
    id: 4,
    name: "Casa de Acolhida da P.A",
    address: "R. São Vicente, 100 - Centro, Londrina - PR, 86020-330",
    lat: -23.3150,
    lng: -51.1642,
    hours: "24 horas",
    acceptedItems: ["clothes", "food"],
  },
  {
    id: 5,
    name: "Meprovi - Movimento de Promoção e Valorização da Vida",
    address: "R. Iugoslávia, 58 - Igapó, Londrina - PR, 86046-240",
    lat: -23.3444,
    lng: -51.1601,
    hours: "Seg-Sex: 8h-17h",
    acceptedItems: ["furniture", "electronics", "clothes"],
  },
  {
    id: 6,
    name: "ONG Viver",
    address: "R. Maurílio C. de Oliveira, 230 - Jd. Los Angeles, Londrina - PR, 86071-610",
    lat: -23.2985,
    lng: -51.1712,
    hours: "Seg-Sex: 9h-16h",
    acceptedItems: ["toys", "books", "clothes"],
  }
];

export const getDonationPoints = () => [...donationPoints];

export const addDonationPoint = (point: Omit<DonationPoint, 'id' | 'distance'>) => {
  const newPoint: DonationPoint = {
    ...point,
    id: donationPoints.length > 0 ? Math.max(...donationPoints.map(p => p.id)) + 1 : 1,
  };
  donationPoints.push(newPoint);
  return newPoint;
}
