import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-soft px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
      </div>
    </main>
  );
}
