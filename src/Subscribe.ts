import { Store } from "./Store";
import type { Types } from "./Types";

export function Subscribe<T>(
  callback: () => T,
  listener: (state: T, prev: T) => void
): Types.CleanUp {
  let [dependencies, state] = Store.Capture(callback);
  let disconnected = false;
  const Handler = () => {
    const previous_state = state;
    Store.Disconnect(dependencies, Handler);

    [dependencies, state] = Store.Capture(callback);
    if (!disconnected) {
      Store.Connect(dependencies, Handler);
    }

    if (state !== previous_state) {
      listener(state, previous_state);
    }
  };

  Store.Connect(dependencies, Handler);

  return () => {
    if (disconnected) return;
    disconnected = true;
    Store.Disconnect(dependencies, Handler);
  };
}
