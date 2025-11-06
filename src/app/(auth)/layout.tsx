import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Hexagon } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <div className="flex min-h-svh flex-col items-center justify-center bg-background p-4">
        <div className="mb-8 flex items-center gap-2 text-primary">
          <Hexagon className="h-8 w-8" />
          <h1 className="font-headline text-3xl font-semibold">PharmaTrust</h1>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </FirebaseClientProvider>
  );
}
