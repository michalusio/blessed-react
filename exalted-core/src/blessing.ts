import Reblessed from "reblessed";
import type Blessed from 'blessed';
const reblessed = (Reblessed as typeof Blessed);
export default reblessed;
export type blessedElement = InstanceType<typeof reblessed.Widgets.BlessedElement>;
export type Screen = InstanceType<typeof reblessed.Widgets.Screen>;