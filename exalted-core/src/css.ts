import { parse } from '@adobe/css-tools';
import { readFileSync } from 'fs';

export function loadRootStylesheet(path: string): void {
  const nodes = parse(readFileSync(path, { encoding: 'utf-8' }), { source: path });
}