import { ListenersMap } from "./ListenersMap";
import { Store } from "./Store";
import type { Types } from "./Types";

export function Atom<T>(): Types.Atom<T | undefined>;
export function Atom<T>(state: T): Types.Atom<T>;
export function Atom<T>(state?: T): Types.Atom<T> {
  const Atom = (...args: T[]) => {
    if (args.length === 0) {
      const capturing_index = Store.Capturing.Index;
      if (capturing_index > 0) {
        Store.Capturing.Stack.get(capturing_index)?.add(Atom);
      }

      return state;
    }

    const next_state = Store.Peek(args[0], state);
    if (state !== next_state) {
      state = next_state;
      Store.Notify(Atom);
    }

    return state;
  };

  Store.Listeners.set(Atom, new ListenersMap());
  return Atom as Types.Atom<T>;
}
