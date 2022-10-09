import { blessedElement } from "./blessing";
import { applyClass } from "./css";
import { hookState } from "./hooks/hook-base";
import { blessedElements, ExaltedNode } from "./jsx";
import { getKey } from "./key";
import { Constructor, flatten, isElement, ItemOrArray } from "./utils";

type JSXItem = typeof Fragment | (keyof JSX.IntrinsicElements) | JSX.Component;

type GetAttributesFor<T extends JSXItem> = 
  T extends (keyof JSX.IntrinsicElements)
    ? JSX.IntrinsicElements[T]
    : (
      T extends Constructor<unknown>
        ? NonNullable<Parameters<T>[0]>
        : never
    );

export default function jsx(
  tag: JSXItem,
  attributes: GetAttributesFor<typeof tag> | undefined,
  ...children: ItemOrArray<ExaltedNode>[]
): ExaltedNode {
  const flatChildren = flatten(children);
  if (tag === 'Fragment') {
    return {
      _name: tag,
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
  const element = blessedElements[tag](attributes as any);

  // set special attributes
  if (attributes) {
    if (attributes.ref) {
      attributes.ref.current = element;
    }
    applyClass(element, attributes.className);
  }


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

export const Fragment: 'Fragment' = 'Fragment';

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
