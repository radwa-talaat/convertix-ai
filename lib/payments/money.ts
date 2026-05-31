export function egpToCents(amountEgp: number): number {
  return Math.round(amountEgp * 100);
}

export function formatEgp(amountCents: number): string {
  return new Intl.NumberFormat("en-EG", {
    currency: "EGP",
    style: "currency",
  }).format(amountCents / 100);
}
