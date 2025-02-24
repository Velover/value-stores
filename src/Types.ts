export namespace Types {
  export type CleanUp = () => void;
  export type Selector<T> = () => T;
  export type Atom<T> = (state?: ((prev: T) => T) | T) => T;
}
