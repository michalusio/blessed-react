import Reblessed, { Screen } from "./blessing";
import { hookState } from "./hooks/hook-base";
import { ExaltedNode } from "./jsx";
import { isElement } from "./utils";

let rootComponent: (() => ExaltedNode) | undefined;
/** @internal */
export let screenObject: Screen | undefined;

export function Bootstrap(component: () => ExaltedNode): void {
  if (rootComponent || screenObject) throw new Error('Cannot call `Bootstrap` more than once!');
  rootComponent = component;
  screenObject = Reblessed.screen({
    smartCSR: true,
    autoPadding: true,
    dockBorders: true,
    title: component.name,
    useBCE: true
  });
  rerender();
}

export function forceRerender() {
  if (!rootComponent || !screenObject) throw new Error('Call `Bootstrap` first before rerendering!');
  setTimeout(rerender);
}

function rerender() {
  if (!rootComponent || !screenObject) return;
  screenObject.children = [];
  addIntoScreen(rootComponent());
  screenObject.render();
  hookState.value = 0;
}

function addIntoScreen(exaltedNode: ExaltedNode) {
  if (!screenObject) return;
  if (typeof exaltedNode === 'number' || typeof exaltedNode === 'string' || typeof exaltedNode === 'boolean') {
    screenObject.append(Reblessed.box({ width: '100%', height: '100%', content: exaltedNode + '' }));
  } else if (isElement(exaltedNode._rendered)) {
    screenObject.append(exaltedNode._rendered);
  } else if (Array.isArray(exaltedNode._rendered)) {
    exaltedNode._rendered.forEach(node => addIntoScreen(node));
  } else {
    addIntoScreen(exaltedNode._rendered);
  }
}
