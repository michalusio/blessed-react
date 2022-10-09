import Reblessed, { blessedElement } from "./blessing";
import { ItemOrArray } from "./utils";
import type { MutableRef } from "./hooks/useRef";
import { CSSClass } from "./css";

export const blessedElements = {
  "bigtext": Reblessed.bigtext,
  "box": Reblessed.box,
  "button": Reblessed.button,
  "checkbox": Reblessed.checkbox,
  "filemanager": Reblessed.filemanager,
  "form": Reblessed.form,
  "input": Reblessed.input,
  "layout": Reblessed.layout,
  "line": Reblessed.line,
  "list": Reblessed.list,
  "listbar": Reblessed.listbar,
  "listtable": Reblessed.listtable,
  "loading": Reblessed.loading,
  "log": Reblessed.log,
  "message": Reblessed.message,
  "progressbar": Reblessed.progressbar,
  "prompt": Reblessed.prompt,
  "question": Reblessed.question,
  "radiobutton": Reblessed.radiobutton,
  "radioset": Reblessed.radioset,
  "scrollablebox": Reblessed.scrollablebox,
  "scrollabletext": Reblessed.scrollabletext,
  "table": Reblessed.table,
  "terminal": Reblessed.terminal,
  "text": Reblessed.text,
  "textarea": Reblessed.textarea,
  "textbox": Reblessed.textbox
};

export type blessedElementsTypes = {
  [E in keyof typeof blessedElements]: ReturnType<typeof blessedElements[E]>;
}

declare global {
  namespace JSX {
    // The return type of our JSX Factory
    type Element = ExaltedNode;

    type elements = typeof blessedElements;

    // IntrinsicElementMap grabs all the reblessed elements
    type IntrinsicElements = {
      [K in keyof elements]: Parameters<elements[K]>[0] & { key?: string | number, ref?: MutableRef<ReturnType<elements[K]>>, className?: CSSClass };
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