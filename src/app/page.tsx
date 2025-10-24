
import { DonationFinder } from '@/components/donation-finder';
import { Header } from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminDashboard } from '@/components/admin-dashboard';
import { MapPin, PlusCircle } from 'lucide-react';
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
              <AdminDashboard />
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
