import BlessedReact from "../src";
import { assertConsole } from "./utils";
import assert from "node:assert";
import { RenderError } from "../src/render-error";
import { EnableDevelopmentMode, ResetMode } from "../src/mode";
import { flatten, modeArray } from "../src/utils";

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
  describe("modeArray", () => {
    const cases: [number[], number | undefined][] = [
      [[1, 2, 3, 3, 3, 4], 3],
      [[1, 2, 3, 4], 1],
      [[1, 1, 1, 2, 3, 4], 1],
      [[3, 3, 3, 4], 3],
      [[4, 4, 4, 4, 1, 1, 1], 4],
      [[], undefined],
    ];
    cases.forEach(([array, expected]) => {
      it(`for [${JSON.stringify(array)}] should return ${expected}`, () => {
        const output = modeArray(array);
        assert.equal(output, expected);
      });
    });
  });
  describe("flatten", () => {
    const cases: [(number | number[])[], number[]][] = [
      [
        [1, 2, 3, 3, 3, 4],
        [1, 2, 3, 3, 3, 4],
      ],
      [
        [1, 2, 3, 4],
        [1, 2, 3, 4],
      ],
      [[], []],
      [
        [1, [2, 3], [3, 3], 4],
        [1, 2, 3, 3, 3, 4],
      ],
      [
        [1, [2, 3], 4],
        [1, 2, 3, 4],
      ],
    ];
    cases.forEach(([array, expected]) => {
      it(`for ${JSON.stringify(array)} should return ${JSON.stringify(
        expected
      )}`, () => {
        const output = flatten(array);
        assert.deepStrictEqual(output, expected);
      });
    });
  });
  describe("in Development Mode", () => {
    beforeEach(() => {
      EnableDevelopmentMode();
    });
    describe("throws a RenderError", () => {
      it("with correct message", () => {
        const Component = () => {
          throw new Error("Something happened!");
          return <box />;
        };
        assert.throws(
          () => BlessedReact.renderIntoString(Component, w, h),
          /^Error while rendering UI: Something happened!$/
        );
      });

      it("without the stack", () => {
        const Component = () => {
          const err = new Error("Something happened!");
          err.stack = undefined;
          throw err;
          return <box />;
        };
        assert.throws(
          () => BlessedReact.renderIntoString(Component, w, h),
          /^Error while rendering UI: Something happened!$/
        );
      });

      it("with correct data", () => {
        const Component = () => {
          throw 27;
          return <box />;
        };
        assert.throws(
          () => BlessedReact.renderIntoString(Component, w, h),
          /^Error while rendering UI: 27$/
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
            const lines = err.stack!.split("\n");
            assert.equal(lines.length, 4);
            assert.match(lines[0], /^    at Component1 \(/);
            assert.match(lines[1], /^    at Component2 \(/);
            assert.match(lines[2], /^    at Component3 \(/);
            assert.match(lines[3], /^    at Component4 \(/);
            return true;
          }
        );
      });
    });
    afterEach(() => {
      ResetMode();
    });
  });
  describe("in Production Mode", () => {
    describe("throws a normal error", () => {
      it("with correct message", () => {
        const Component = () => {
          throw new Error("Something happened!");
          return <box />;
        };
        assert.throws(
          () => BlessedReact.renderIntoString(Component, w, h),
          /^Error: Something happened!$/
        );
      });

      it("with native trace", () => {
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
            if (err instanceof RenderError) {
              assert.fail("Error is RenderError");
            }
            if (!(err instanceof Error)) {
              assert.fail("Error is not an Error instance");
            }
            assert.equal((err.stack?.length ?? 0) > 10, true);
            return true;
          }
        );
      });
    });
  });
});
