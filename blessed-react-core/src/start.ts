import Reblessed, { Screen } from "./blessing";
import { hookState } from "./hooks/hook-base";
import { BlessedNode } from "./jsx";
import { RenderError } from "./render-error";
import { isElement } from "./utils";
import { PassThrough, Writable } from "node:stream";

type BootstrapOptions = Readonly<{
  /**
   * Automatically re-render the screen every X milliseconds.
   * Useful for terminals where the resize event does not work.
   */
  autoRefresh?: number;
}>;

let rootComponent: (() => BlessedNode) | undefined;
let outputOverride: Writable | undefined;

export let screenObject: Screen | undefined;

export function OverrideOutput(output?: Writable) {
  outputOverride = output;
}

export function Bootstrap(
  component: () => BlessedNode,
  options?: BootstrapOptions
): void {
  options ??= {};
  if (rootComponent || screenObject)
    throw new Error("Cannot call `Bootstrap` more than once!");
  rootComponent = component;
  screenObject = Reblessed.screen({
    smartCSR: true,
    autoPadding: true,
    dockBorders: true,
    useBCE: true,
  });
  screenObject.program.output = outputOverride ?? screenObject.program.output;

  if (options.autoRefresh) {
    setInterval(forceRerender, options.autoRefresh);
  }
  rerender();
}

export function ResetBootstrap() {
  try {
    screenObject?.destroy();
  } finally {
    screenObject = undefined;
    rootComponent = undefined;
  }
}

export function renderIntoString(
  component: () => BlessedNode,
  terminalWidth: number,
  terminalHeight: number
): string {
  if (!component) return "";
  const screen = Reblessed.screen({
    smartCSR: true,
    autoPadding: true,
    dockBorders: true,
    useBCE: true,
    width: terminalWidth,
    height: terminalHeight,
  });
  screen.program.cols = terminalWidth;
  screen.program.rows = terminalHeight;
  const outStream = new PassThrough();
  screen.program.output = outStream;
  try {
    addIntoScreen(component(), screen);
    screen.render();
    return (screen.program as any)._buf;
  } catch (err) {
    screen.destroy();
    throw new RenderError(err);
  } finally {
    hookState.value = 0;
    outStream.end();
    screen.destroy();
  }
}

let lastTimeoutId: NodeJS.Timeout | undefined;

export function forceRerender() {
  if (!rootComponent || !screenObject)
    throw new Error("Call `Bootstrap` first before rerendering!");
  clearTimeout(lastTimeoutId);
  lastTimeoutId = setTimeout(rerender);
}

function rerender() {
  try {
    if (!rootComponent || !screenObject) return;
    [...screenObject.children].forEach((ch) => {
      screenObject!.remove(ch);
      ch.destroy();
    });
    try {
      addIntoScreen(rootComponent(), screenObject);
      screenObject.render();
    } catch (err) {
      screenObject.destroy();
      throw new RenderError(err);
    }
    hookState.value = 0;
  } catch (err) {
    if (err instanceof RenderError) {
      throw err.toString();
    } else throw err;
  }
}

function addIntoScreen(blessedNode: BlessedNode, screen: Screen) {
  if (typeof blessedNode === "boolean" || blessedNode == null) return;
  if (typeof blessedNode === "function") {
    addIntoScreen(blessedNode(), screen);
  } else if (
    typeof blessedNode === "number" ||
    typeof blessedNode === "string"
  ) {
    const content = blessedNode + "";
    screen.append(
      Reblessed.box({
        width: content.length,
        height: 1,
        top: screen.children.length,
        content,
      })
    );
  } else if (isElement(blessedNode._rendered)) {
    screen.append(blessedNode._rendered);
  } else if (Array.isArray(blessedNode._rendered)) {
    blessedNode._rendered.forEach((node) => addIntoScreen(node, screen));
  } else {
    addIntoScreen(blessedNode._rendered, screen);
  }
}
