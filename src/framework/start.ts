import { box, screen, Widgets } from "reblessed";
import { hookId } from "./hooks/hook-base";
import { ExaltedNode } from "./jsx";

let rootComponent: (() => ExaltedNode) | undefined;
export let screenObject: Widgets.Screen | undefined;

export function Bootstrap(component: () => ExaltedNode): void {
  if (rootComponent || screenObject) throw new Error('Cannot call `Bootstrap` more than once!');
  rootComponent = component;
  screenObject = screen({
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
  const node = rootComponent();
  if (typeof node === 'number' || typeof node === 'string') {
    screenObject.append(box({ width: '100%', height: '100%', content: node + '' }));
  } else if (node._blessedNode) {
    screenObject.append(node._blessedNode);
  }
  screenObject.render();
  hookId.value = 0;
}