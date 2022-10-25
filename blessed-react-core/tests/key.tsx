import { getKey } from "../src/key";
import assert from "node:assert";

describe("key", () => {
  it("when given a component, should return the name", () => {
    const TestComponent = () => "test";
    const output = getKey(TestComponent, null);
    assert.equal(output, "TestComponent");
  });
  it("when given no key, should return the name", () => {
    const TestComponent = () => "test";
    const output = getKey(TestComponent, {});
    assert.equal(output, "TestComponent");
  });
  it("when given a string key, should return the key", () => {
    const TestComponent = () => "test";
    const output = getKey(TestComponent, { key: "test-key" });
    assert.equal(output, "test-key");
  });
  it("when given a number key, should return the key", () => {
    const TestComponent = () => "test";
    const output = getKey(TestComponent, { key: 1365 });
    assert.equal(output, 1365);
  });
  it("when given a null key, should return the name", () => {
    const TestComponent = () => "test";
    const output = getKey(TestComponent, { key: null });
    assert.equal(output, "TestComponent");
  });
  it("when given an invalid key, should return the name", () => {
    const TestComponent = () => "test";
    const output = getKey(TestComponent, { key: () => "test-key" });
    assert.equal(output, "TestComponent");
  });
});
