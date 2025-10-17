import { DonationFinder } from '@/components/donation-finder';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <DonationFinder />
      </main>
      <footer className="py-6 bg-transparent">
        <p className="text-center text-sm text-muted-foreground">
          GuiaDoar - Projeto de extensão universitária UniFil.
        </p>
      </footer>
    </div>
  );
}
