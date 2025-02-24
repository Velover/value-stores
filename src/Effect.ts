import { Store } from "./Store";
import type { Types } from "./Types";

export function Effect(
  callback: (cleanup: Types.CleanUp) => Types.CleanUp | void
): Types.CleanUp {
  let disconnected = false;
  const Listener = () => {
    cleanup?.();
    Store.Disconnect(dependencies, Listener);
    [dependencies, cleanup] = Store.Capture(callback, Disconnect);
    if (disconnected) return;
    Store.Connect(dependencies, Listener);
  };

  const Disconnect = () => {
    if (disconnected) return;
    disconnected = true;
    Store.Disconnect(dependencies, Listener);
    cleanup?.();
  };

  let [dependencies, cleanup] = Store.Capture(callback, Disconnect);

  if (!disconnected) Store.Connect(dependencies, Listener);
  return Disconnect;
}
