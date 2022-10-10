import { splitBorders } from "./border";
import { splitPaddings } from "./padding";

export function splitProperty(key: string, value: string): [string, string][] {
  return splitBorders(key, value)
      ?? (splitPaddings(key, value)
      ?? [[key, value]]);
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