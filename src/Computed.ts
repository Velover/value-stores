import { Atom } from "./Atom";
import { Store } from "./Store";
import type { Types } from "./Types";

export function Computed<T>(callback: Types.Selector<T>): Types.Selector<T> {
  let [dependencies, state] = Store.Capture(callback);
  const computed_atom = Atom(state);
  const computed_ref = new WeakRef(computed_atom);
  const Listener = () => {
    const computed_atom = computed_ref.deref();
    if (computed_atom === undefined) return;

    Store.Disconnect(dependencies, Listener);
    [dependencies, state] = Store.Capture(callback);
    Store.Connect(dependencies, Listener, computed_atom);
    computed_atom(state);
  };

  Store.Connect(dependencies, Listener, computed_atom);
  return computed_atom;
}
