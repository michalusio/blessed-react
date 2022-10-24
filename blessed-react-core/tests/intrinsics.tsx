import BlessedReact from "../src";
import { assertConsole } from "./utils";

const w = 80;
const h = 15;

describe("Intrinsics", () => {
  it("renders a box", () => {
    const component = () => (
      <box border={"line"} width={14} height={3}>
        Hello World!
      </box>
    );

    const output = BlessedReact.renderIntoString(component, w, h);

    assertConsole(
      output,
      ["┌────────────┐", "│Hello World!│", "└────────────┘"],
      w,
      h
    );
  });
  it("renders a progress bar", () => {
    const component = () => (
      <progressbar border={"line"} filled={40} ch="*" width={14} height={3} />
    );

    const output = BlessedReact.renderIntoString(component, w, h);

    assertConsole(
      output,
      ["┌────────────┐", "│****        │", "└────────────┘"],
      w,
      h
    );
  });
});
