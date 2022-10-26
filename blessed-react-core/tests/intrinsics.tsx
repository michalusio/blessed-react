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
  it("renders a box with elements", () => {
    const component = () => (
      <box width={14} height={3}>
        <>
          {"Hello"}
          {[false, () => 123]}
          {true}
        </>
        <box width={6} height={3} right={0} border={"line"}>
          <box>Test</box>
        </box>
      </box>
    );

    const output = BlessedReact.renderIntoString(component, w, h);

    assertConsole(
      output,
      ["Hello123┌────┐", "        │Test│", "        └────┘"],
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
