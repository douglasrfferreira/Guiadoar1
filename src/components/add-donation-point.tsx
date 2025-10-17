"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { addDonationPoint } from "@/lib/donation-points";
import { categoryNames } from "@/components/icons";
import type { DonationCategory } from "@/lib/types";
import { PlusCircle, Send, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AddDonationPoint() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [acceptedItems, setAcceptedItems] = useState<DonationCategory[]>([]);
  const { toast } = useToast();

  const handleCheckboxChange = (category: DonationCategory) => {
    setAcceptedItems(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !address || !hours || acceptedItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }
    
    // As a real implementation would need a geocoding service to get lat/lng from address,
    // we'll use placeholder coordinates for now.
    addDonationPoint({
        name,
        address,
        hours,
        acceptedItems,
        lat: -23.31, // Placeholder
        lng: -51.16, // Placeholder
    });


    toast({
      title: "Ponto de Doação Adicionado!",
      description: `O ponto "${name}" foi adicionado. Ele já está visível na busca.`,
    });

    // Reset form
    setName("");
    setAddress("");
    setHours("");
    setAcceptedItems([]);
  };

  return (
    <div className="w-full space-y-8 mt-4">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2">
            <PlusCircle /> Cadastrar Novo Ponto de Coleta
          </CardTitle>
          <CardDescription className="text-lg">
            Ajude a expandir nossa rede de solidariedade.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">Nome do Ponto de Coleta</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Paróquia Nossa Senhora" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-base">Endereço Completo</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, Número, Bairro, Cidade - Estado, CEP" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours" className="text-base">Horário de Funcionamento</Label>
              <Input id="hours" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Ex: Seg-Sex: 8h-18h" required />
            </div>
            <div className="space-y-4">
                <Label className="text-base">Itens Aceitos</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {(Object.keys(categoryNames) as DonationCategory[]).map(category => (
                        <div key={category} className="flex items-center space-x-2">
                            <Checkbox 
                                id={category} 
                                checked={acceptedItems.includes(category)}
                                onCheckedChange={() => handleCheckboxChange(category)}
                            />
                            <label
                                htmlFor={category}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {categoryNames[category]}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              <Send className="mr-2" />
              Enviar Cadastro
            </Button>
          </form>
        </CardContent>
      </Card>
      <Alert>
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Aviso</AlertTitle>
        <AlertDescription>
         Os pontos de doação cadastrados serão salvos no banco de dados.
        </AlertDescription>
      </Alert>
    </div>
  );
}
