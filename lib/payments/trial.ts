export function createTrialEndDate(trialDays: number): string | null {
  if (trialDays <= 0) {
    return null;
  }

  const date = new Date();
  date.setDate(date.getDate() + trialDays);

  return date.toISOString();
}

export function isExpired(date: string | null) {
  return Boolean(date && new Date(date).getTime() < Date.now());
}
