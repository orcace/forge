export interface CaseConverterInput {
  value: string;
}

export function normalizeCaseConverterInput(input: string): string {
  return input.trim();
}

export function hasCaseConverterInput(input: string): boolean {
  return normalizeCaseConverterInput(input).length > 0;
}
