import type { DonationPoint, UserProfile } from '@/lib/types';
import { DonationPointCard } from './donation-point-card';

interface DonationPointListProps {
  points: DonationPoint[];
  userProfile: UserProfile | null;
}

export function DonationPointList({ points, userProfile }: DonationPointListProps) {
  return (
    <section className="space-y-6 animate-in fade-in-50 duration-500">
      <h2 className="text-2xl font-headline font-bold text-center text-primary border-b-2 border-primary/20 pb-2">
        Pontos de Coleta Encontrados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {points.map((point) => (
          <DonationPointCard key={point.id} point={point} userProfile={userProfile} />
        ))}
      </div>
    </section>
  );
}
