import BlessedReact from "../../src";
import { BlessedNode } from "../../src/jsx";
import { assertConsole } from "../utils";

const w = 80;
const h = 15;

describe("Visibility", () => {
  const cases: [() => BlessedNode, string[]][] = [
    [() => <box>Hello World!</box>, ["Hello World!"]],
    [
      () => (
        <box
          className={{
            visibility: "hidden",
          }}
        >
          Hello World!
        </box>
      ),
      [""],
    ],
    [
      () => (
        <box
          className={{
            visibility: "visible",
          }}
        >
          Hello World!
        </box>
      ),
      ["", " Hello World!"],
    ],
  ];

  cases.forEach(([component, expected]) => {
    it(`for "${component + ""}", renders "${expected.join()}"`, () => {
      const output = BlessedReact.renderIntoString(component, w, h);

      assertConsole(output, expected, w, h);
    });
  });
});
