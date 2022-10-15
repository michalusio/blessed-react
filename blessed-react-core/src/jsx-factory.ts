import { blessedElement } from "./blessing";
import { applyClass } from "./css";
import { hookState } from "./hooks/hook-base";
import { blessedElements, BlessedNode } from "./jsx";
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
  ...children: ItemOrArray<BlessedNode>[]
): BlessedNode {
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

  const [actualAttributes, eventHandlers] = attributes ? splitAttributes(attributes) : [{}, {}];

  const element = blessedElements[tag](actualAttributes as any);

  // attach event handlers
  Object.entries(eventHandlers).forEach(([type, handler]) => {
    element.on(type, handler);
  });

  // set special attributes
  if (actualAttributes.ref) {
    actualAttributes.ref.current = element;
  }
  applyClass(element, actualAttributes.className);


  // append children
  if (!('content' in actualAttributes)) {
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

function splitAttributes<T extends keyof JSX.IntrinsicElements>(attributes: GetAttributesFor<T>): [Exclude<JSX.IntrinsicElements[T], JSX.ElementEventProperties<T>>, JSX.ElementEventProperties<T>] {
  const handlers: Record<string, unknown> = {};
  const normal: Record<string, unknown> = {};
  Object.entries(attributes).forEach(([key, value]) => {
    if (key.length > 2 && key.startsWith('on') && key[2] === key[2].toUpperCase()) {
      handlers[key.substring(2).toLowerCase()] = value;
    } else {
      normal[key] = value;
    }
  });
  return [normal as Exclude<JSX.IntrinsicElements[T], JSX.ElementEventProperties<T>>, handlers as JSX.ElementEventProperties<T>];
}

function appendChild(element: blessedElement, child: BlessedNode) {
  if (typeof child === "string") {
    element.content += child;
    return;
  }
  if (typeof child === 'number') {
    element.content += child;
    return;
  }
  if (typeof child === 'boolean' || child == null) {
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
