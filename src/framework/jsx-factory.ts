import { Widgets } from "reblessed";
import { blessedElements, ExaltedNode } from "./jsx";

export default function jsx(
  tag: keyof JSX.IntrinsicElements,
  attributes: JSX.IntrinsicElements[typeof tag],
  ...children: ExaltedNode[]
): ExaltedNode;
export default function jsx(
  tag: JSX.Component,
  attributes: NonNullable<Parameters<typeof tag>[0]>,
  ...children: ExaltedNode[]
): ExaltedNode;
export default function jsx(
  tag: (keyof JSX.IntrinsicElements) | JSX.Component,
  attributes: any,
  ...children: ExaltedNode[]
): ExaltedNode {
  if (typeof tag === "function") {
    return tag(attributes ?? {}, children);
  } 
  const element = blessedElements[tag](attributes);

  // append children
  if (!('content' in (attributes ?? {}))) {
    element.content = '';
  }
  children.forEach(child => appendChild(element, child));
  return {
    _blessedNode: element,
    _children: children
  };
}

function appendChild(element: Widgets.BlessedElement, child: ExaltedNode) {
  if (typeof child === "string") {
    element.content += child;
    return;
  }
  if (typeof child === 'number') {
    element.content += child;
    return;
  }
  if (typeof child === 'boolean') {
    if (child) {
      element.content += child;
    }
    return;
  }
  if (child._blessedNode) {
    if (!element.children.includes(child._blessedNode)) {
      element.append(child._blessedNode);
    }
  } else {
    child._children.forEach(ch => appendChild(element, ch));
  }
}