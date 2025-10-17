"use client";

import { HandHeart, LogOut, User as UserIcon, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useSignOut } from '@/firebase/auth/use-user';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export function Header() {
  const { user, loading } = useUser();
  const signOut = useSignOut();

  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <header className="bg-card shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
            <HandHeart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-headline font-bold text-primary">
            GuiaDoar
            </h1>
        </Link>

        <div>
            {loading && <Skeleton className="h-10 w-24" />}
            {!loading && user ? (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                    {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'Avatar do usuário'} />}
                    <AvatarFallback>
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon />}
                    </AvatarFallback>
                    </Avatar>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'Usuário'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                    </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost">
                  <Link href="/login">
                    <LogIn className="mr-2"/>
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">
                    <UserIcon className="mr-2"/>
                    Cadastrar
                  </Link>
                </Button>
              </div>
            )}
        </div>
      </div>
    </header>
  );
}
