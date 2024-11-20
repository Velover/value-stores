import RemoveElementFromArray from "./RemoveElementFromArray";
import type { CleanUp } from "./Types";

export default class Broadcaster<T extends unknown[]> {
  private listeners_: ((...args: T) => void)[] = [];

  Listen(callback: (...args: T) => void): CleanUp {
    this.listeners_.push(callback);
    return () => {
      RemoveElementFromArray(this.listeners_, callback);
    };
  }

  Fire(...args: T) {
    for (const listener of this.listeners_) {
      try {
        listener(...args);
      } catch (error_message) {
        console.warn(error_message);
      }
    }
  }
}