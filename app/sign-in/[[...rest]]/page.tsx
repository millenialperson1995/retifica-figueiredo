import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 
              'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
          }
        }}
      />
    </div>
  );
}