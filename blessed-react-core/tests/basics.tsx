import BlessedReact from "../src";
import { BlessedNode } from "../src/jsx";
import { assertConsole } from "./utils";

const w = 80;
const h = 15;

describe("Basics", () => {
  const cases = [
    [() => "Hello World!", ["Hello World!"]],
    [() => 765232, ["765232"]],
    [() => true, [""]],
    [() => false, [""]],
    [() => null, [""]],
    [() => undefined, [""]],
    [() => 0, ["0"]],
    [() => () => "Hi!", ["Hi!"]],
  ] as [() => BlessedNode, string[]][];

  cases.forEach(([component, expected]) => {
    it(`for "${component + ""}", renders "${expected.join("")}"`, () => {
      const output = BlessedReact.renderIntoString(component, w, h);

      assertConsole(output, expected, w, h);
    });
  });
});
