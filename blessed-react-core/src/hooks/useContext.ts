import { Context } from "../jsx/context";

export function useContext<T>(context: Context<T>): T {
  let current: T;
  context.Consumer({}, v => {
    current = v;
    return null;
  });
  return current!;
}