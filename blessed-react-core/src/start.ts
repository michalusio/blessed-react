import Reblessed, { Screen } from "./blessing";
import { hookState } from "./hooks/hook-base";
import { BlessedNode } from "./jsx";
import { RenderError } from "./render-error";
import { isElement } from "./utils";

type BootstrapOptions = Readonly<{
  /**
   * Automatically re-render the screen every X milliseconds.
   * Useful for terminals where the resize event does not work.
   */
  autoRefresh?: number;
}>;

let rootComponent: (() => BlessedNode) | undefined;

export let screenObject: Screen | undefined;

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
  if (options.autoRefresh) {
    setInterval(forceRerender, options.autoRefresh);
  }
  rerender();
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
  addIntoScreen(component(), screen);
  try {
    screen.render();
    return (screen.program as any)._buf;
  } finally {
    hookState.value = 0;
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
      throw new RenderError(err, rootComponent.name);
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
    addIntoScreen(blessedNode(""), screen);
    return;
  }
  if (typeof blessedNode === "number" || typeof blessedNode === "string") {
    screen.append(
      Reblessed.box({
        width: "100%",
        height: "100%",
        content: blessedNode + "",
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
