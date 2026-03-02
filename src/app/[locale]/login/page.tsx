import LoginForm from "./LoginForm";


export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">
                Login
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                Inserisci le credenziali admin.
              </p>
            </div>
            
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
