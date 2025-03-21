import { Atom } from "./Atom.js";
import { Computed } from "./Computed.js";
import { Effect } from "./Effect.js";
import { Store } from "./Store.js";
import { Subscribe } from "./Subscribe.js";
import type { Types } from "./Types.js";

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
