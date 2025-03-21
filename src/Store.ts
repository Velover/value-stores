import type { ListenersMap } from "./ListenersMap.js";
import type { Types } from "./Types.js";

export namespace Store {
  export const Capturing = {
    Stack: new Map<number, Set<Types.Atom<any>>>(),
    Index: 0,
  };

  export const Listeners = new WeakMap<Types.Atom<any>, ListenersMap>();
  const batched = new Set<() => void>();
  let is_batching = false;

  export function Peek<T, U extends unknown[]>(
    callback: ((...args: U) => T) | T,
    ...args: U
  ): T {
    if (typeof callback !== "function") {
      return callback;
    }
    const callback_ = callback as (...args: U) => T;
    if (Capturing.Index === 0) return callback_(...args);

    Capturing.Index += 1;
    try {
      return callback_(...args);
    } finally {
      Capturing.Index -= 1;
    }
  }

  export function IsAtom(value: unknown): value is Types.Atom<any> {
    return value !== undefined && Listeners.has(value as Types.Atom<any>);
  }

  export function Notify(atom: Types.Atom<any>) {
    const listeners_list = Listeners.get(atom)?.GetKeys();
    if (listeners_list === undefined) throw "Atom is not valid";

    if (is_batching) {
      for (const listener of listeners_list) {
        batched.add(listener);
      }
      return;
    }

    for (const listener of listeners_list) {
      try {
        listener();
      } catch {}
    }
  }

  export function Capture<T, U extends unknown[]>(
    callback: (...args: U) => T,
    ...args: U
  ): [Set<Types.Atom<any>>, T] {
    //if the callback is Atom, return it immediately
    if (Listeners.has(callback as never)) {
      return [new Set([callback as never]), Peek(callback, ...args)];
    }

    const dependencies = new Set<Types.Atom<any>>();
    Capturing.Index += 1;
    Capturing.Stack.set(Capturing.Index, dependencies);

    try {
      return [dependencies, callback(...args)];
    } finally {
      Capturing.Stack.delete(Capturing.Index);
      Capturing.Index -= 1;
    }
  }

  export function Batch(callback: () => void) {
    if (is_batching) return callback();
    is_batching = true;

    try {
      callback();
    } finally {
      is_batching = false;
    }

    for (const listener of batched) {
      try {
        listener();
      } catch {}
    }

    batched.clear();
  }

  export function Connect(
    atoms: Set<Types.Atom<unknown>>,
    listener: () => void,
    ref?: object
  ) {
    for (const atom of atoms) {
      Listeners.get(atom)?.Set(listener, ref ?? true);
    }
  }

  export function Disconnect(
    atoms: Set<Types.Atom<unknown>>,
    listener: () => void
  ) {
    for (const atom of atoms) {
      Listeners.get(atom)?.Delete(listener);
    }
  }
}
