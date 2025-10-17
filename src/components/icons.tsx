import type { LucideIcon } from 'lucide-react';
import { Shirt, Apple, ToyBrick, Laptop, Sofa, BookOpen } from 'lucide-react';
import type { DonationCategory } from '@/lib/types';

export const categoryIcons: Record<DonationCategory, LucideIcon> = {
  clothes: Shirt,
  food: Apple,
  toys: ToyBrick,
  electronics: Laptop,
  furniture: Sofa,
  books: BookOpen,
};

export const categoryNames: Record<DonationCategory, string> = {
  clothes: 'Roupas',
  food: 'Alimentos',
  toys: 'Brinquedos',
  electronics: 'Eletrônicos',
  furniture: 'Móveis',
  books: 'Livros',
};
