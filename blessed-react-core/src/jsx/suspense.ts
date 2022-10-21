import { useCallback, useContext, useRef, useState } from "../hooks";
import type { ItemOrArray } from "../utils";
import { createContext } from "./context";
import type { BlessedNode } from "./jsx";
import { jsx } from "./jsx-factory";

const SuspenseContext = createContext<{
  suspenseCount: number;
  increaseSuspenseCount: () => void;
  decreaseSuspenseCount: () => void;
}>({
  get suspenseCount(): number {
    throw new Error("No context defined");
  },
  increaseSuspenseCount: () => {
    throw new Error("No context defined");
  },
  decreaseSuspenseCount: () => {
    throw new Error("No context defined");
  },
});

export const Suspense = (
  { fallback }: { fallback: BlessedNode },
  children: ItemOrArray<BlessedNode>[]
) => {
  const [suspenseCount, updateSuspenseCount] = useState(0);
  const increaseSuspenseCount = useCallback(
    () => updateSuspenseCount((count) => count + 1),
    [updateSuspenseCount]
  );
  const decreaseSuspenseCount = useCallback(
    () => updateSuspenseCount((count) => count - 1),
    [updateSuspenseCount]
  );
  return suspenseCount
    ? fallback
    : jsx(
        SuspenseContext.Provider,
        {
          value: {
            suspenseCount,
            increaseSuspenseCount,
            decreaseSuspenseCount,
          },
        },
        ...children
      );
};

const lazyMap = new Map<
  () => Promise<{ default: JSX.Component }>,
  Promise<JSX.Component>
>();

export const lazy = <T extends JSX.Component<any>>(
  importer: () => Promise<{ default: T }>
): T => {
  return ((args: Parameters<T>[0], children: Parameters<T>[1]) => {
    const suspenseState = useContext(SuspenseContext);
    const component = useRef<T | undefined>();
    if (!component.current) {
      let promise: Promise<T> | undefined = lazyMap.get(importer) as
        | Promise<T>
        | undefined;
      if (!promise) {
        promise = importer()
          .then((i) => i.default)
          .catch((err) => {
            throw err;
          });
        lazyMap.set(importer, promise);
      }
      promise.then((node) => {
        component.current = node;
        suspenseState.decreaseSuspenseCount();
      });
      suspenseState.increaseSuspenseCount();
    }
    return component.current
      ? jsx(component.current, args, ...(children ?? []))
      : null;
  }) as T;
};
