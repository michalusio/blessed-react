import BlessedReact from "../src";
import { assertConsole } from "./utils";
import assert from "node:assert";
import { RenderError } from "../src/render-error";

const w = 80;
const h = 15;

describe("Utilities", () => {
  describe("renderIntoString", () => {
    it("renders a simple component", () => {
      const Component = () => {
        return <box />;
      };
      assert.doesNotThrow(() => BlessedReact.renderIntoString(Component, w, h));
    });

    it("renders a fragment component", () => {
      const Component = () => {
        return (
          <>
            {123}
            {"Hi!"}
          </>
        );
      };
      const output = BlessedReact.renderIntoString(Component, w, h);
      assertConsole(output, ["123", "Hi!"], w, h);
    });

    it("renders a nested component", () => {
      const Component2 = () => {
        return "Hi!";
      };
      const Component = () => {
        return <Component2 />;
      };
      const output = BlessedReact.renderIntoString(Component, w, h);
      assertConsole(output, ["Hi!"], w, h);
    });

    it("renders a nested fragment component", () => {
      const Component2 = () => {
        return "Hi!";
      };
      const Component = () => {
        return (
          <>
            <Component2 />
            <Component2 />
            <Component2 />
          </>
        );
      };
      const output = BlessedReact.renderIntoString(Component, w, h);
      assertConsole(output, ["Hi!", "Hi!", "Hi!"], w, h);
    });
  });
  describe("on broken component", () => {
    describe("throws a RenderError", () => {
      it("with correct message", () => {
        const Component = () => {
          throw new Error("Something happened!");
          return <box />;
        };
        assert.throws(
          () => BlessedReact.renderIntoString(Component, w, h),
          /^Error while rendering UI: Something happened!\n/
        );
      });

      it("with component trace", () => {
        const Component1 = () => {
          throw new Error("Something happened!");
          return <box />;
        };
        const Component2 = () => {
          return <Component1 />;
        };
        const Component3 = () => {
          return <Component2 />;
        };
        const Component3x = () => {
          return <box />;
        };
        const Component4 = () => {
          return (
            <>
              <Component3x />
              <Component3 />
            </>
          );
        };
        assert.throws(
          () => BlessedReact.renderIntoString(Component4, w, h),
          (err) => {
            if (!(err instanceof RenderError)) {
              assert.fail("Error is not RenderError");
            }
            const lines = err.toString().split("\n");
            assert.equal(lines.length, 5);
            assert.match(lines[1], /^    at Component1 \(/);
            assert.match(lines[2], /^    at Component2 \(/);
            assert.match(lines[3], /^    at Component3 \(/);
            assert.match(lines[4], /^    at Component4 \(/);
            return true;
          }
        );
      });
    });
  });
});
