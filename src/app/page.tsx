import { DonationFinder } from '@/components/donation-finder';
import { Header } from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddDonationPoint } from '@/components/add-donation-point';
import { MapPin, PlusCircle, LogIn, Shield } from 'lucide-react';
import { AuthGate } from '@/components/auth-gate';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AdminDashboard } from '@/components/admin-dashboard';
import { useUser } from '@/firebase';

function AdminGate({ children }: { children: React.ReactNode }) {
    const { user, profile, loading } = useUser();
  
    if (loading) {
      return null;
    }
  
    if (!user || profile?.role !== 'admin') {
      return (
        <div className="text-center py-10">
          <div className="flex flex-col items-center gap-4">
            <LogIn className="w-12 h-12 text-muted-foreground" />
            <h3 className="text-xl font-bold">Acesso Restrito</h3>
            <p className="text-muted-foreground max-w-md">
              Esta área é restrita aos administradores. Por favor, faça login com uma conta de administrador para continuar.
            </p>
            <div className="flex gap-4 mt-4">
              <Button asChild>
                <Link href="/login">Fazer Login</Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }
  
    return <>{children}</>;
  }


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
              <TabsTrigger value="admin">
                <Shield className="mr-2" />
                Administração
              </TabsTrigger>
            </TabsList>
            <TabsContent value="finder">
              <DonationFinder />
            </TabsContent>
            <TabsContent value="admin">
                <AdminGate>
                    <AdminDashboard />
                </AdminGate>
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
