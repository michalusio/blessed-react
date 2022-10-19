import { Symbolize } from "../utils";
import { BlessedNode, ExoticComponent } from "./jsx";

export interface FragmentProps {
  children?: BlessedNode | undefined;
}

export const FragmentSymbol: unique symbol = Symbol('Fragment');

export const Fragment: ExoticComponent<typeof FragmentSymbol, FragmentProps> = Symbolize(() => null, FragmentSymbol);