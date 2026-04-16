export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-foreground">KnowBase</h1>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
