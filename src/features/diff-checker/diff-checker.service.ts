export interface DiffCheckerInput {
  value: string;
}

export function normalizeDiffCheckerInput(input: string): string {
  return input.trim();
}

export function hasDiffCheckerInput(input: string): boolean {
  return normalizeDiffCheckerInput(input).length > 0;
}
