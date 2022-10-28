import assert from "assert";

function fillOut(input: string[], cols: number, rows: number): string {
  const line = " ".repeat(cols);
  return [
    ...input.map((i) => i.padEnd(cols)),
    ...Array(rows - input.length).fill(line),
  ]
    .map((l) => l + "\n")
    .join("");
}

/**
 * Assert console output equality
 * @param actual The console output to check.
 * @param expected The expected console output.
 * @param w The width of the virtual console screen
 * @param h The height of the virtual console screen
 */
export function assertConsole(
  actual: string,
  expected: string[],
  w: number,
  h: number
): void {
  assert.strictEqual(actual, fillOut(expected, w, h));
}
