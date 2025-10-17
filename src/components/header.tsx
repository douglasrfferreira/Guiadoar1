import { HandHeart } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <HandHeart className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">
          GuiaDoar
        </h1>
      </div>
    </header>
  );
}
