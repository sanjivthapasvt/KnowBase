// theme: dark schema applied
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, type RegisterFormData } from '../schemas';
import { useAuth } from '../hooks/useAuth';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { extractErrorMessage } from '@/types/api';
import Link from 'next/link';

export function RegisterForm() {
  const { register: registerUser, isRegistering, registerError } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  return (
    <div className="bg-[rgb(var(--color-bg-surface-2))] border border-[rgb(var(--color-border-default))] rounded-xl p-6">
      <h2 className="text-[rgb(var(--color-text-primary))] text-lg font-semibold mb-6">Create Account</h2>
      <form onSubmit={handleSubmit((data) => registerUser({ email: data.email, password: data.password, full_name: data.full_name }))} className="space-y-4">
        <label className="text-[rgb(var(--color-text-secondary))] text-[13px] block -mb-2">Full Name</label>
        <Input placeholder="John Doe" error={errors.full_name?.message} {...register('full_name')} />
        <label className="text-[rgb(var(--color-text-secondary))] text-[13px] block -mb-2 mt-2">Email</label>
        <Input type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <label className="text-[rgb(var(--color-text-secondary))] text-[13px] block -mb-2 mt-2">Password</label>
        <Input type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
        <label className="text-[rgb(var(--color-text-secondary))] text-[13px] block -mb-2 mt-2">Confirm Password</label>
        <Input type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        {registerError && <p className="text-[12px] text-[rgb(var(--color-danger-text))] bg-[rgb(var(--color-danger-bg))] rounded-md px-3 py-2">{extractErrorMessage(registerError)}</p>}
        <Button type="submit" loading={isRegistering} className="w-full mt-4">Create Account</Button>
        <p className="text-center text-sm text-[rgb(var(--color-text-muted))] mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-[rgb(var(--color-text-link))] hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
