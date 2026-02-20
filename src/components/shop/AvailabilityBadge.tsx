export function AvailabilityBadge({ available }: { available: number }) {
  if (available <= 0) {
    return (
      <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
        Esaurito
      </span>
    );
  }

  if (available <= 5) {
    return (
      <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
        Pochi pezzi
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
      Disponibile
    </span>
  );
}
