"use client";

import { useState } from 'react';
import type { DonationPoint, DonationCategory } from '@/lib/types';
import { donationPoints as allDonationPoints } from '@/lib/donation-points';
import { haversineDistance } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, LocateFixed, TriangleAlert } from 'lucide-react';
import { DonationPointList } from './donation-point-list';
import { useToast } from "@/hooks/use-toast";
import { categoryNames } from '@/components/icons';

export function DonationFinder() {
  const [itemDescription, setItemDescription] = useState('');
  const [foundPoints, setFoundPoints] = useState<DonationPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getCategoryFromDescription = (description: string): DonationCategory | null => {
    if (!description) return null;
    const lowerCaseDescription = description.toLowerCase().trim();
    for (const key in categoryNames) {
      const category = key as DonationCategory;
      if (categoryNames[category].toLowerCase() === lowerCaseDescription) {
        return category;
      }
    }
    return null;
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setFoundPoints([]);

    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada pelo seu navegador.");
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Erro de Localização",
        description: "Geolocalização não é suportada pelo seu navegador.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const searchedCategory = getCategoryFromDescription(itemDescription);

        const filteredPoints = searchedCategory
          ? allDonationPoints.filter(point => point.acceptedItems.includes(searchedCategory))
          : allDonationPoints;
        
        const pointsWithDistance = filteredPoints.map(point => ({
          ...point,
          distance: haversineDistance(latitude, longitude, point.lat, point.lng),
        }));

        const sortedPoints = pointsWithDistance.sort((a, b) => a.distance - b.distance);

        setFoundPoints(sortedPoints);
        setIsLoading(false);
        if (sortedPoints.length === 0 && searchedCategory) {
          toast({
            variant: 'default',
            title: 'Nenhum ponto encontrado',
            description: `Não encontramos pontos de coleta que aceitem "${itemDescription}". Tente uma busca mais ampla.`,
          });
        }
      },
      (geoError) => {
        let errorMessage = "Ocorreu um erro ao obter sua localização.";
        if (geoError.code === geoError.PERMISSION_DENIED) {
          errorMessage = "Você precisa permitir o acesso à sua localização para encontrar pontos próximos.";
        }
        setError(errorMessage);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Erro de Localização",
          description: errorMessage,
        });
      }
    );
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Facilite sua Doação</CardTitle>
          <CardDescription className="text-lg">
            Informe o que deseja doar e encontraremos os pontos de coleta mais próximos de você.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
            <Input
              type="text"
              placeholder="Ex: Roupas, Alimentos, Brinquedos..."
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              className="flex-grow text-base"
              aria-label="Itens para doar"
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LocateFixed className="h-5 w-5 mr-2" />
              )}
              Encontrar Pontos de Coleta
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="flex justify-center items-center gap-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
            <p className="text-lg text-muted-foreground">Buscando sua localização e pontos próximos...</p>
        </div>
      )}

      {!isLoading && foundPoints.length > 0 && (
        <DonationPointList points={foundPoints} />
      )}
      
      {!isLoading && foundPoints.length === 0 && !error && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nenhum ponto de coleta encontrado ou a busca ainda não foi realizada.</p>
        </div>
      )}
    </div>
  );
}
