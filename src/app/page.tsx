import { DonationFinder } from '@/components/donation-finder';
import { Header } from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddDonationPoint } from '@/components/add-donation-point';
import { MapPin, PlusCircle, LogIn } from 'lucide-react';
import { AuthGate } from '@/components/auth-gate';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function Home() {
  return (
    <FirebaseClientProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Tabs defaultValue="finder" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="finder">
                <MapPin className="mr-2" />
                Encontrar Pontos
              </TabsTrigger>
              <TabsTrigger value="register">
                <PlusCircle className="mr-2" />
                Cadastrar Ponto
              </TabsTrigger>
            </TabsList>
            <TabsContent value="finder">
              <DonationFinder />
            </TabsContent>
            <TabsContent value="register">
              <AuthGate
                unauthenticatedContent={
                  <div className="text-center py-10">
                     <div className="flex flex-col items-center gap-4">
                        <LogIn className="w-12 h-12 text-muted-foreground" />
                        <h3 className="text-xl font-bold">Acesso Restrito</h3>
                        <p className="text-muted-foreground max-w-md">
                          Para cadastrar um novo ponto de coleta, você precisa fazer login. Isso garante a qualidade e a segurança das informações em nossa plataforma.
                        </p>
                      </div>
                  </div>
                }
              >
                <AddDonationPoint />
              </AuthGate>
            </TabsContent>
          </Tabs>
        </main>
        <footer className="py-6 bg-transparent">
          <p className="text-center text-sm text-muted-foreground">
            GuiaDoar - Projeto de extensão universitária UniFil.
          </p>
        </footer>
      </div>
    </FirebaseClientProvider>
  );
}
