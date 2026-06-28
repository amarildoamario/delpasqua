import { setRequestLocale } from 'next-intl/server';
import LoginForm from "./LoginForm";
import { pageMetadata } from "@/lib/seo";


export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return pageMetadata({
    title: "Login",
    description: "Login amministrazione.",
    path: "/login/",
    locale,
    index: false,
    hreflang: false,
  });
}

function LoginPage() {
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


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function LoginPageWrapper(props: any) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return <LoginPage {...props} />;
}
