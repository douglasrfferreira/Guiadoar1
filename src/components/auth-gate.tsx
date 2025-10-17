"use client";
import React from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { Loader2 } from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
  unauthenticatedContent?: React.ReactNode;
}

export function AuthGate({ children, unauthenticatedContent }: AuthGateProps) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <>{unauthenticatedContent}</>;
  }

  return <>{children}</>;
}
