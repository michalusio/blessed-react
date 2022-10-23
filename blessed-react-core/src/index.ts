import {
  jsx,
  Fragment,
  ExoticComponent,
  FragmentProps,
  FragmentSymbol,
  BlessedNode,
} from "./jsx";
import { Bootstrap, forceRerender, renderIntoString } from "./start";
import { EnableDevelopmentMode } from "./mode";
import { createContext } from "./jsx/context";
import { lazy } from "./jsx/suspense";

export * from "./hooks";
export type { blessedElementsTypes as elementTypes } from "./jsx";
export { loadStylesheet } from "./css";
export { Suspense } from "./jsx/suspense";
export type { IMouseEventArg, IKeyEventArg, Screen } from "./blessing";
export type { Context } from "./jsx/context";
export type { ItemOrArray } from "./utils";

export default {
  jsx,
  Bootstrap,
  EnableDevelopmentMode,
  forceRerender,
  Fragment,
  createContext,
  lazy,
  renderIntoString,
};
