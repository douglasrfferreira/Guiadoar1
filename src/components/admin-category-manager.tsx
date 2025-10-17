
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { addCategory, getCategories } from "@/components/icons";
import type { DonationCategory } from "@/lib/types";
import { Tag, PlusCircle, Send } from "lucide-react";
import { Badge } from "./ui/badge";

export function AdminCategoryManager() {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryKey, setNewCategoryKey] = useState("");
  const [categories, setCategories] = useState<Record<DonationCategory, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = getCategories(setCategories);
    return () => unsubscribe();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCategoryKey || !newCategoryName) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "Preencha a chave e o nome da nova categoria.",
      });
      return;
    }
    addCategory(newCategoryKey, newCategoryName);
    toast({
      title: "Categoria Adicionada!",
      description: `A categoria "${newCategoryName}" foi adicionada com sucesso.`,
    });
    setNewCategoryKey("");
    setNewCategoryName("");
  };

  return (
    <div className="w-full space-y-8 mt-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline flex items-center gap-2">
            <Tag /> Gerenciar Categorias
          </CardTitle>
          <CardDescription>
            Adicione novas categorias de itens para doação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold">Categorias Atuais</h4>
            <div className="flex flex-wrap gap-2">
                {Object.entries(categories).map(([key, name]) => (
                    <Badge key={key} variant="secondary">{name}</Badge>
                ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category-key">Chave da Categoria</Label>
                    <Input 
                        id="category-key" 
                        value={newCategoryKey} 
                        onChange={(e) => setNewCategoryKey(e.target.value.toLowerCase().replace(/\s+/g, '-'))} 
                        placeholder="Ex: eletronicos" 
                        required 
                    />
                     <p className="text-xs text-muted-foreground">Use apenas letras minúsculas, sem espaços ou acentos.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category-name">Nome da Categoria</Label>
                    <Input 
                        id="category-name" 
                        value={newCategoryName} 
                        onChange={(e) => setNewCategoryName(e.target.value)} 
                        placeholder="Ex: Eletrônicos" 
                        required 
                    />
                </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              <Send className="mr-2" />
              Adicionar Categoria
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
