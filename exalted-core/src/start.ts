import Reblessed, { Screen } from "./blessing";
import { cursorTo } from 'node:readline';
import { hookState } from "./hooks/hook-base";
import { ExaltedNode } from "./jsx";
import { isElement } from "./utils";

type BootstrapOptions = Readonly<{
  /**
   * Automatically re-render the screen every X milliseconds.
   * Useful for terminals where the resize event does not work.
   */
  autoRefresh?: number
}>;

let rootComponent: (() => ExaltedNode) | undefined;
/** @internal */
export let screenObject: Screen | undefined;

export function Bootstrap(component: () => ExaltedNode, options?: BootstrapOptions): void {
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
  screenObject.children = [];
  try {
    addIntoScreen(rootComponent());
    screenObject.render();
  } catch (err) {
    screenObject.destroy();
    cursorTo(process.stdout, 0, 0, () => {
      let message = '';
      if (err instanceof Error) {
        message = err.message + '\n' + (err.stack ?? '');
      } else message = JSON.stringify(err);
      console.error('\033[91;40m'+message+'\033[37;40m');
    });
  }
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
