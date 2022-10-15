import { CSSStyleSheet, loadStylesheetFromFile } from "./stylesheet";
import { FSWatcher, watch } from 'chokidar';
import { forceRerender } from "../start";
import { getMode } from "../mode";
import { normalize } from 'node:path';

let fileWatcher: FSWatcher | undefined;
export const fileCache = new Map<string, CSSStyleSheet>();

export function loadStylesheet(path: string): CSSStyleSheet {
  initializeFileWatcher();

  path = normalize(path);

  if (!fileCache.has(path)) {
    fileCache.set(path, loadStylesheetFromFile(path));
    fileWatcher?.add(path);
  }
  return getMode() === 'production'
    ? fileCache.get(path)!
    : new Proxy<CSSStyleSheet>({}, {
    get(_, prop, __) {
      if (typeof prop === 'symbol') return {};
      return fileCache.get(path)![prop];
    }
  });
}

function reloadCache(path: string) {
  fileCache.set(path, loadStylesheetFromFile(path));
  forceRerender();
}

function initializeFileWatcher() {
  if (getMode() === 'production' || fileWatcher) return;
  fileWatcher = watch([], { disableGlobbing: true, ignoreInitial: true });
  fileWatcher.on('all', (e, path, stats) => {
    if (e === 'unlink') {
      fileCache.delete(path);
      fileWatcher!.unwatch(path);
    } else setTimeout(() => reloadCache(path));
  })
}