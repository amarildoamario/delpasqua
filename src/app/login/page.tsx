import LoginForm from "./LoginForm";
import ThemeToggle from "@/components/theme/ThemeToggle";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-950">
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                Login
              </h1>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                Inserisci le credenziali admin.
              </p>
            </div>
            <ThemeToggle />
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
