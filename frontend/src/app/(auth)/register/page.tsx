// src/app/(auth)/register/page.tsx
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Create Account — KnowBase', description: 'Create a new KnowBase account' };

export default function RegisterPage() {
  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-white">Create your account</h2>
      <RegisterForm />
    </>
  );
}
