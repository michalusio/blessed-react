import assert from "assert";

type Cursor = { x: number; y: number };
type Command = (
  match: RegExpMatchArray,
  terminal: string[][],
  cursor: Cursor,
  w: number,
  h: number
) => void;

const commands: [RegExp, Command][] = [
  [
    /\u001B\[\d+(?:;\d+)?m/g,
    (m, t, c) => {
      //console.log("color");
    },
  ],
  [
    /\u001b\[(\d+)A/g,
    (m, t, c) => {
      //console.log("up", Number.parseInt(m[1]));
      c.y -= Number.parseInt(m[1]);
    },
  ],
  [
    /\u001b\[(\d+)B/g,
    (m, t, c) => {
      //console.log("down", Number.parseInt(m[1]));
      c.y += Number.parseInt(m[1]);
    },
  ],
  [
    /\u001b\[(\d+)C/g,
    (m, t, c) => {
      //console.log("right", Number.parseInt(m[1]));
      c.x += Number.parseInt(m[1]);
    },
  ],
  [
    /\u001b\[(\d+)D/g,
    (m, t, c) => {
      //console.log("left", Number.parseInt(m[1]));
      c.x -= Number.parseInt(m[1]);
    },
  ],
  [
    /\u001b\[(\d+)?J/g,
    (m, t, c, w, h) => {
      //console.log("clear", Number.parseInt(m[1]));
      t.forEach((_, i) => {
        switch (Number.parseInt(m[1])) {
          case 0:
            break;
          case 1:
            break;
          default:
            t[i] = " ".repeat(w).split("");
            break;
        }
      });
    },
  ],
  [
    /\u001b\[(\d+)E/g,
    (m, t, c) => {
      //console.log("downline", Number.parseInt(m[1]));
      c.x = 0;
      c.y += Number.parseInt(m[1]);
    },
  ],
  [
    /\u001b\[(\d+)F/g,
    (m, t, c) => {
      //console.log("upline", Number.parseInt(m[1]));
      c.x = 0;
      c.y -= Number.parseInt(m[1]);
    },
  ],
  [
    /\u001b\[(\d+)G/g,
    (m, t, c) => {
      //console.log("column", Number.parseInt(m[1]));
      c.x = Number.parseInt(m[1]) - 1;
    },
  ],
  [
    /\u001b\[(\d+);(\d+)H/g,
    (m, t, c) => {
      //console.log("pos", Number.parseInt(m[2]), Number.parseInt(m[1]));
      c.y = Number.parseInt(m[1]) - 1;
      c.x = Number.parseInt(m[2]) - 1;
    },
  ],
  [
    /\u001b\[H/g,
    (m, t, c) => {
      //console.log("pos", 1, 1);
      c.x = 0;
      c.y = 0;
    },
  ],
  [
    /\u001b\[(\d+)K/g,
    (m, t, c, w, h) => {
      //console.log("clearline", m["1"]);
      t.forEach((_, i) => {
        switch (m["1"]) {
          case "0":
            t[c.y] = t[c.y].map((a, i) => (i < c.x ? a : " "));
            break;
          case "1":
            t[c.y] = t[c.y].map((a, i) => (i > c.x ? a : " "));
            break;
          case "2":
            t[c.y] = " ".repeat(w).split("");
            break;
        }
      });
    },
  ],
];

function parseMarks(output: string, cols: number, rows: number): string {
  const terminalData = " "
    .repeat(rows)
    .split("")
    .map((r) => r.repeat(cols).split(""));
  const cursor = { x: 0, y: 0 };
  for (let i = 0; i < output.length; i++) {
    const c = commands
      .map((c) => {
        c[0].lastIndex = i;
        const match = c[0].exec(output);
        if (match && match.index === i) {
          return [match, c[1]] as [RegExpMatchArray, Command];
        } else return undefined;
      })
      .find((c) => c !== undefined);
    if (c) {
      c[1](c[0], terminalData, cursor, cols, rows);
      i += c[0][0].length - 1;
    } else {
      try {
        terminalData[cursor.y][cursor.x] = output[i];
      } catch (err) {
        console.info(cursor);
        throw err;
      }
      cursor.x++;
      if (cursor.x >= cols) {
        cursor.x = 0;
        cursor.y++;
      }
    }
  }
  return terminalData.map((r) => r.join("")).join("\n");
}

function fillOut(input: string[], cols: number, rows: number): string {
  const line = " ".repeat(cols);
  return [
    ...input.map((i) => i.padEnd(cols)),
    ...Array(rows - input.length).fill(line),
  ].join("\n");
}

/**
 * Assert console output equality
 * @param actual The console output to check. Color ANSI codes will be omitted.
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
  assert.strictEqual(parseMarks(actual, w, h), fillOut(expected, w, h));
}
