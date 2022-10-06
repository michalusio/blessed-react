import { box, list, progressbar, text, Widgets } from "reblessed";
import { ItemOrArray } from "./utils";

export const blessedElements = {
  "boxElement": box,
  "progressBar": progressbar,
  "list": list,
  "text": text
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
        children?: ItemOrArray<Element>[]
      ): Element;
    }
  }
}

export type ExaltedNode = Readonly<{
  _name: string;
  _children: ExaltedNode[];
  _rendered: ExaltedNode | Widgets.BlessedElement | ExaltedNode[];
}> | string | number | boolean;