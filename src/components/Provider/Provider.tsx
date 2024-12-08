"use client"
import React from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import { SessionProvider } from 'next-auth/react';

type Props = {
  children: React.ReactNode
}

const queryClient = new QueryClient();

const Provider = ({ children }: Props) => {
  return (
    <SessionProvider>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </RecoilRoot>
    </SessionProvider>
  )
}

export default Provider