import { BlessedNode, ExoticComponent } from "./jsx";
import { ItemOrArray, Symbolize } from "../utils";
import { jsx } from "./jsx-factory";
import { Fragment } from "./fragment";

interface ProviderProps<T> {
  value: T;
  children: ItemOrArray<BlessedNode>;
}

interface ConsumerProps<T> {
  children: (value: T) => BlessedNode;
}

export type Provider<T> = ExoticComponent<typeof ProviderSymbol, ProviderProps<T>>;
export type Consumer<T> = ExoticComponent<typeof ConsumerSymbol, ConsumerProps<T>>;

export const ConsumerSymbol: unique symbol = Symbol('Consumer');
export const ProviderSymbol: unique symbol = Symbol('Provider');

export type Context<T> = {
  readonly Provider: Provider<T>;
  readonly Consumer: Consumer<T>;
};

export function createContext<T>(defaultValue: T): Context<T> {
  const valueStack = [defaultValue];
  const context: Context<T> = {
    Consumer: Symbolize((_props: {}, children: (value: T) => BlessedNode) => {
      return children(valueStack[valueStack.length - 1]);
    }, ConsumerSymbol),
    Provider: Symbolize((props: {value: T}, children: ItemOrArray<BlessedNode>) => {
      return () => {
        valueStack.push(props.value);
        const child = typeof children !== 'function' ? jsx(Fragment, undefined, children) : children();
        valueStack.pop();
        return child;
      }
    }, ProviderSymbol)
  }
  return context;
}