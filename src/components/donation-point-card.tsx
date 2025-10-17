import type { DonationPoint, UserProfile } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, PackageCheck, Pencil, Trash2 } from 'lucide-react';
import { categoryIcons, categoryNames } from '@/components/icons';
import { Button } from './ui/button';
import { deleteDonationPoint } from '@/lib/donation-points';
import { useToast } from '@/hooks/use-toast';
import { EditDonationPointDialog } from './edit-donation-point-dialog';
import { useState } from 'react';

interface DonationPointCardProps {
  point: DonationPoint;
  userProfile: UserProfile | null;
}

export function DonationPointCard({ point, userProfile }: DonationPointCardProps) {
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Tem certeza que deseja excluir o ponto "${point.name}"?`)) {
      try {
        await deleteDonationPoint(point.id);
        toast({
          title: "Ponto de Doação Excluído",
          description: `O ponto "${point.name}" foi removido com sucesso.`,
        });
      } catch (error) {
        console.error("Failed to delete donation point:", error);
        toast({
          variant: "destructive",
          title: "Erro ao Excluir",
          description: "Não foi possível remover o ponto de doação.",
        });
      }
    }
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <>
      <Card className="flex flex-col h-full bg-card hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-xl text-primary">{point.name}</CardTitle>
            {isAdmin && (
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditDialogOpen(true)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
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
                      {Icon && <Icon className="h-4 w-4 text-primary" />}
                      <span>{categoryNames[item] || item}</span>
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
      {isAdmin && (
        <EditDonationPointDialog
          point={point}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </>
  );
}
