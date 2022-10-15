import Reblessed, { blessedElement, IMouseEventArg, Screen } from "./blessing";
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
} as const;

export type blessedElementsTypes = {
  [E in keyof typeof blessedElements]: ReturnType<typeof blessedElements[E]>;
}

declare global {
  namespace JSX {

    type NodeScreenEventType =
        | "focus"
        | "blur"
        | "click";

    type NodeMouseEventType =
        | "mouse"
        | "mouseout"
        | "mouseover"
        | "mousedown"
        | "mouseup"
        | "mousewheel"
        | "wheeldown"
        | "wheelup"
        | "mousemove";
    
    type NodeGenericEventType =
        | "resize"
        | "prerender"
        | "render"
        | "destroy"
        | "move"
        | "show"
        | "hide";

    type AddPrefix<T extends string, U extends string> = {
      [X in U]: `${T}${Capitalize<X>}`
    }[U];

    type onParameters<T extends keyof elements> = Parameters<ReturnType<elements[T]>['on']>;

    type ElementEventProperties<T extends keyof elements> = {
      [X in AddPrefix<'on', onParameters<T>[0]>]?: (listener: onParameters<T>[1]) => void;
    } & {
      [X in AddPrefix<'on', NodeMouseEventType>]?: (listener: (arg: IMouseEventArg) => void) => void;
    } & {
      [X in AddPrefix<'on', NodeScreenEventType>]?: (listener: (arg: Screen) => void) => void;
    } & {
      [X in AddPrefix<'on', NodeGenericEventType>]?: (listener: () => void) => void;
    }

    type elements = typeof blessedElements;

    type ElementSpecialProperties<K extends keyof elements> = { key?: string | number, ref?: MutableRef<ReturnType<elements[K]>>, className?: CSSClass };

    // The return type of our JSX Factory
    type Element = BlessedNode;

    // IntrinsicElementMap grabs all the reblessed elements
    type IntrinsicElements = {
      [K in keyof elements]: Parameters<elements[K]>[0] & ElementSpecialProperties<K> & ElementEventProperties<K>;
    }

    interface Component {
      (
        properties?: { [key: string]: any },
        children?: ItemOrArray<Element>[]
      ): Element;
    }
  }
}

export type BlessedNode = Readonly<{
  _name: string;
  _children: BlessedNode[];
  _rendered: BlessedNode | blessedElement | BlessedNode[];
}> | string | number | boolean | undefined | null;