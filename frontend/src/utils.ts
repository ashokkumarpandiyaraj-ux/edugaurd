import type { RiskLevel } from './types';

export const riskOrder: Record<RiskLevel, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export function formatChange(value: number): string {
  const arrow = value < 0 ? '↓' : value > 0 ? '↑' : '→';
  return `${arrow} ${Math.abs(value)}%`;
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
