import Reblessed from "reblessed";
import type * as Blessed from 'blessed';

const reblessed = (Reblessed as typeof Blessed);

export default reblessed;

export type blessedElement = InstanceType<typeof reblessed.Widgets.BlessedElement>;
export type Screen = InstanceType<typeof reblessed.Widgets.Screen>;
export type Border = Blessed.Widgets.Border;
export type IKeyEventArg = Blessed.Widgets.Events.IKeyEventArg;
export type IMouseEventArg = Blessed.Widgets.Events.IMouseEventArg;