import Reblessed, { blessedElement } from "./blessing";
import { ItemOrArray } from "./utils";

export const blessedElements = {
  "boxelement": Reblessed.box,
  "progressbar": Reblessed.progressbar,
  "list": Reblessed.list,
  "text": Reblessed.text,
  "button": Reblessed.button,
  "checkbox": Reblessed.checkbox,
  "filemanager": Reblessed.filemanager,
  "form": Reblessed.form
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
  _rendered: ExaltedNode | blessedElement | ExaltedNode[];
}> | string | number | boolean;