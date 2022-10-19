import Reblessed, { Screen } from "./blessing";
import { hookState } from "./hooks/hook-base";
import { BlessedNode } from "./jsx";
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

export function Bootstrap(component: () => BlessedNode, options?: BootstrapOptions): void {
  options ??= {};
  if (rootComponent || screenObject) throw new Error('Cannot call `Bootstrap` more than once!');
  rootComponent = component;
  screenObject = Reblessed.screen({
    smartCSR: true,
    autoPadding: true,
    dockBorders: true,
    title: component.name,
    useBCE: true
  });
  if (options.autoRefresh) {
    setInterval(forceRerender, options.autoRefresh);
  }
  rerender();
}

export function forceRerender() {
  if (!rootComponent || !screenObject) throw new Error('Call `Bootstrap` first before rerendering!');
  setTimeout(rerender);
}

function rerender() {
  if (!rootComponent || !screenObject) return;
  [...screenObject.children].forEach(ch => {
    screenObject!.remove(ch);
    ch.destroy();
  });
  try {
    addIntoScreen(rootComponent());
    screenObject.render();
  } catch (err) {
    screenObject.destroy();
    throw err;
  }
  hookState.value = 0;
}

function addIntoScreen(blessedNode: BlessedNode) {
  if (!screenObject) return;
  if (typeof blessedNode === 'boolean' || blessedNode == null) return;
  if (typeof blessedNode === 'function') {
    addIntoScreen(blessedNode(''));
    return;
  }
  if (typeof blessedNode === 'number' || typeof blessedNode === 'string') {
    screenObject.append(Reblessed.box({ width: '100%', height: '100%', content: blessedNode + '' }));
  } else if (isElement(blessedNode._rendered)) {
    screenObject.append(blessedNode._rendered);
  } else if (Array.isArray(blessedNode._rendered)) {
    blessedNode._rendered.forEach(node => addIntoScreen(node));
  } else {
    addIntoScreen(blessedNode._rendered);
  }
}
