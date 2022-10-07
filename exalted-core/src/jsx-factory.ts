import { blessedElement } from "./blessing";
import { hookState } from "./hooks/hook-base";
import { blessedElements, ExaltedNode } from "./jsx";
import { getKey } from "./key";
import { flatten, isElement, ItemOrArray } from "./utils";

export default function jsx(
  tag: keyof JSX.IntrinsicElements,
  attributes: JSX.IntrinsicElements[typeof tag],
  ...children: ItemOrArray<ExaltedNode>[]
): ExaltedNode;
export default function jsx(
  tag: JSX.Component,
  attributes: NonNullable<Parameters<typeof tag>[0]>,
  ...children: ItemOrArray<ExaltedNode>[]
): ExaltedNode;
export default function jsx(
  tag: typeof Fragment,
  attributes: undefined,
  ...children: ItemOrArray<ExaltedNode>[]
): ExaltedNode;
export default function jsx(
  tag: (keyof JSX.IntrinsicElements) | JSX.Component,
  attributes: Record<string, unknown> | undefined,
  ...children: ItemOrArray<ExaltedNode>[]
): ExaltedNode {
  const flatChildren = flatten(children);
  if (tag === Fragment) {
    return {
      _name: tag.name,
      _children: flatChildren,
      _rendered: flatChildren
    };
  }
  if (typeof tag === "function") {
    pushHookState(getKey(tag, attributes));
    const rendered = tag(attributes ?? {}, children);
    popHookState();
    return {
      _name: tag.name,
      _children: flatChildren,
      _rendered: rendered
    };
  } 
  const element = blessedElements[tag](attributes);

  // append children
  if (!('content' in (attributes ?? {}))) {
    element.content = '';
  }
  flatChildren.forEach(child => appendChild(element, child));
  return {
    _name: tag,
    _children: flatChildren,
    _rendered: element
  };
}

export const Fragment = () => false;

function appendChild(element: blessedElement, child: ExaltedNode) {
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
  if (!child._rendered) { return; }
  const render = child._rendered;
  if (isElement(render)) {
    element.append(render);
  } else if (Array.isArray(render)) {
    render.forEach(node => appendChild(element, node));
  } else {
    appendChild(element, render);
  }
}

function pushHookState(key: string) {
  hookState.rope.push(key);
}

function popHookState() {
  hookState.rope.pop();
}