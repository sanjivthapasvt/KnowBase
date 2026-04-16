'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, type LoginFormData } from '../schemas';
import { useAuth } from '../hooks/useAuth';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { extractErrorMessage } from '@/types/api';
import Link from 'next/link';
export function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  return (
    <div className="bg-bg-surface2/70 backdrop-blur-xl rounded-2xl p-10 shadow-[0_20px_80px_rgba(0,0,0,0.9)] border border-white/5">

      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold text-text-primary tracking-tight">
          Welcome back
        </h1>
        <p className="text-text-secondary mt-3">
          Sign in to your account
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit((data) => login(data))}
        className="space-y-6"
      >
        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs text-text-secondary">
            Email
          </label>
          <Input
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-xs text-text-secondary">
            Password
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        {/* Error */}
        {loginError && (
          <div className="text-sm text-danger-text bg-danger-bg/50 border border-white/10 rounded-lg px-4 py-3">
            {extractErrorMessage(loginError)}
          </div>
        )}

        {/* Button */}
        <Button
          type="submit"
          loading={isLoggingIn}
          className="w-full h-11 mt-2 text-sm font-medium glow"
        >
          Sign In
        </Button>

        {/* Footer */}
        <p className="text-center text-sm text-text-muted pt-4">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-text-link hover:text-brand-light transition"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}