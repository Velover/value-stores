import { Atom } from "./Atom";
import { Computed } from "./Computed";
import { Effect } from "./Effect";
import { Store } from "./Store";
import { Subscribe } from "./Subscribe";
import type { Types } from "./Types";

export type Atom<T> = Types.Atom<T>;
export const atom = Atom;
export const computed = Computed;
export const effect = Effect;
export const subscribe = Subscribe;
export const batch = Store.Batch;
export const capture = Store.Capture;
export const isAtom = Store.IsAtom;
export const peek = Store.Peek;
export const notify = Store.Notify;
