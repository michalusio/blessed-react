import { box, progressbar, Widgets } from "reblessed";

export const blessedElements = {
  "boxElement": box,
  'progressBar': progressbar
};

type elements = typeof blessedElements;

declare global {
  namespace JSX {
    // The return type of our JSX Factory
    type Element = ExaltedNode;

    // IntrinsicElementMap grabs all the reblessed elements
    type IntrinsicElements = {
      [K in keyof elements]: Parameters<elements[K]>[0];
    }

    interface Component {
      (
        properties?: { [key: string]: any },
        children?: ExaltedNode[]
      ): ExaltedNode;
    }
  }
}

export type ExaltedNode = PureExaltedNode | string | number | boolean;

type PureExaltedNode = Readonly<{
  /**
   * The `reblessed` node this node references. `undefined` for custom components.
   */
  _blessedNode?: Widgets.BlessedElement;
  _children: ExaltedNode[];
}>;