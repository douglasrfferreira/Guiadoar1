import type { DonationPoint } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, PackageCheck } from 'lucide-react';
import { categoryIcons, categoryNames } from '@/components/icons';

interface DonationPointCardProps {
  point: DonationPoint;
}

export function DonationPointCard({ point }: DonationPointCardProps) {
  return (
    <Card className="flex flex-col h-full bg-card hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary">{point.name}</CardTitle>
        <CardDescription className="flex items-start gap-2 pt-2 text-foreground">
          <MapPin className="h-5 w-5 mt-1 shrink-0 text-muted-foreground" />
          <span>{point.address}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{point.hours}</span>
        </div>
        <div>
            <h4 className="flex items-center gap-2 mb-2 font-semibold text-sm">
                <PackageCheck className="h-4 w-4 text-primary" />
                Itens Aceitos
            </h4>
            <div className="flex flex-wrap gap-2">
            {point.acceptedItems && point.acceptedItems.map((item) => {
                const Icon = categoryIcons[item];
                return (
                <Badge key={item} variant="secondary" className="flex items-center gap-1.5 py-1 px-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{categoryNames[item]}</span>
                </Badge>
                );
            })}
            </div>
        </div>
      </CardContent>
      {point.distance && (
        <CardFooter>
            <div className="w-full text-right font-bold text-primary">
                Aproximadamente {point.distance?.toFixed(1)} km de distância
            </div>
        </CardFooter>
      )}
    </Card>
  );
}
