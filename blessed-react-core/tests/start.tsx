import BlessedReact from "../src";
import {
  Bootstrap,
  forceRerender,
  OverrideOutput,
  ResetBootstrap,
} from "../src/start";
import assert from "node:assert";
import { before } from "mocha";
import { PassThrough } from "node:stream";
import { EnableDevelopmentMode } from "../src/mode";

describe("Bootstrap", () => {
  before(() => {
    OverrideOutput(new PassThrough());
  });
  afterEach(() => {
    ResetBootstrap();
  });

  it("should render when called", () => {
    const Component = () => {
      return <box></box>;
    };
    assert.doesNotThrow(() => Bootstrap(Component));
  });
  it("should error when called twice", () => {
    const Component = () => {
      return <box></box>;
    };
    assert.doesNotThrow(() => Bootstrap(Component));
    assert.throws(() => Bootstrap(Component));
  });
  it("should be able to rerender", (done) => {
    const Component = () => {
      return <box></box>;
    };
    assert.doesNotThrow(() => Bootstrap(Component));
    assert.doesNotThrow(() => forceRerender());
    setTimeout(done, 10);
  });
  it("should error when rerendering without Bootstrap", () => {
    assert.throws(() => forceRerender());
  });
  it("should error when enabling development mode after Bootstrap", () => {
    const Component = () => {
      return <box></box>;
    };
    assert.doesNotThrow(() => Bootstrap(Component));
    assert.throws(() => EnableDevelopmentMode());
  });
});
