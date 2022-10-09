import { splitBorders } from "./border";

export function splitProperty(key: string, value: string): [string, string][] {
  const borderData = splitBorders(key, value);
  if (borderData) return borderData;
  return [[key, value]];
}

export const transformPropertyName: Record<string, string> = {
  'color': 'fg',
  'background-color': 'bg',
  'text-align': 'align',
  'vertical-align': 'valign'
}

export function transformPropertyValue(value: string): string {
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.substring(1, value.length - 1);
  }
  if (value.endsWith('px') || value.endsWith('em')) {
    return value.substring(0, value.length - 2);
  }
  if (value.endsWith('rem')) {
    return value.substring(0, value.length - 3);
  }
  return value;
}