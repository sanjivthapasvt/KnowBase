// src/app/(auth)/login/page.tsx
import { LoginForm } from '@/features/auth/components/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign In — KnowBase', description: 'Sign in to your KnowBase account' };

export default function LoginPage() {
  return (
    <>
      <LoginForm />
    </>
  );
}
