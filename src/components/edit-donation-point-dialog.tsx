
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getCategories } from "@/components/icons";
import type { DonationCategory, DonationPoint } from "@/lib/types";
import { Send, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { updateDonationPoint } from "@/lib/donation-points";

interface EditDonationPointDialogProps {
  point: DonationPoint;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditDonationPointDialog({ point, isOpen, onOpenChange }: EditDonationPointDialogProps) {
  const [name, setName] = useState(point.name);
  const [address, setAddress] = useState(point.address);
  const [hours, setHours] = useState(point.hours);
  const [acceptedItems, setAcceptedItems] = useState<DonationCategory[]>(point.acceptedItems);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [categories, setCategories] = useState<Record<DonationCategory, string>>({});

  useEffect(() => {
    const unsubscribe = getCategories(setCategories);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen) {
        setName(point.name);
        setAddress(point.address);
        setHours(point.hours);
        setAcceptedItems(point.acceptedItems);
    }
  }, [isOpen, point]);


  const handleCheckboxChange = (category: DonationCategory) => {
    setAcceptedItems(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!name || !address || !hours || acceptedItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      setIsLoading(false);
      return;
    }
    
    updateDonationPoint(point.id, {
        name,
        address,
        hours,
        acceptedItems,
        // lat and lng are not editable in this form
    });

    toast({
      title: "Ponto de Doação Atualizado!",
      description: `O ponto "${name}" foi atualizado com sucesso.`,
    });

    onOpenChange(false);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Editar Ponto de Coleta</DialogTitle>
                <DialogDescription>
                    Atualize as informações do ponto de coleta. Clique em salvar quando terminar.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
                <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-base">Nome do Ponto de Coleta</Label>
                <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                <Label htmlFor="edit-address" className="text-base">Endereço Completo</Label>
                <Input id="edit-address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="space-y-2">
                <Label htmlFor="edit-hours" className="text-base">Horário de Funcionamento</Label>
                <Input id="edit-hours" value={hours} onChange={(e) => setHours(e.target.value)} required />
                </div>
                <div className="space-y-4">
                    <Label className="text-base">Itens Aceitos</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-48 overflow-y-auto">
                        {(Object.keys(categories) as DonationCategory[]).map(category => (
                            <div key={category} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`edit-${category}`} 
                                    checked={acceptedItems.includes(category)}
                                    onCheckedChange={() => handleCheckboxChange(category)}
                                />
                                <label
                                    htmlFor={`edit-${category}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {categories[category]}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2" />}
                      Salvar Alterações
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
}
