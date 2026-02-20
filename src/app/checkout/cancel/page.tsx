export default function Cancel({ searchParams }: { searchParams: { orderId?: string } }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-serif text-3xl">Pagamento annullato</h1>
      <p className="mt-4 text-zinc-600">Ordine: {searchParams.orderId}</p>
    </div>
  );
}
