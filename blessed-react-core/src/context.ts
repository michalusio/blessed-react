import { useEffect } from "./hooks";
import { BlessedNode, ExoticComponent } from "./jsx";
import { Symbolize } from "./utils";

interface ProviderProps<T> {
  value: T;
  children?: BlessedNode | undefined;
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
    Consumer: Symbolize((_props: {}, children: (value: T) => BlessedNode) => children(valueStack[valueStack.length - 1]), ConsumerSymbol),
    Provider: Symbolize((props: ProviderProps<T>) => {
      useEffect(() => {
        valueStack.push(props.value);
        return () => valueStack.pop();
      }, []);
      const childNode = props.children;
      return typeof childNode === 'function' ? childNode('') : childNode;
    }, ProviderSymbol)
  }
  return context;
}