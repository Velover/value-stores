# value-stores

A lightweight, reactive state management library for TypeScript. `value-stores` provides primitive atoms that can be composed to create complex state management solutions.

> This is a vanilla TypeScript port of the [@rbxts/charm](https://github.com/littensy/charm) library.

## Installation

```bash
# Using npm
npm install value-stores

# Using pnpm
pnpm add value-stores

# Using bun
bun add value-stores
```

## Core Concepts

- **Atoms**: Basic units of state that are readable and writable
- **Computed Values**: Derived state that automatically updates when dependencies change
- **Effects**: Side effects that automatically run when dependencies change
- **Subscriptions**: Listen for changes to any state

## Basic Usage

```typescript
import { atom, computed, effect, subscribe } from "value-stores";

// Create an atom with initial state
const countAtom = atom(0);

// Read the current value
console.log(countAtom()); // 0

// Update the value
countAtom(1);
console.log(countAtom()); // 1

// Update using a function
countAtom((prev) => prev + 1);
console.log(countAtom()); // 2

// Create derived state with computed
const doubledCount = computed(() => countAtom() * 2);
console.log(doubledCount()); // 4

// Create an effect that runs when dependencies change
const cleanup = effect(() => {
  console.log(`Count is now: ${countAtom()}`);
  return () => console.log("Cleaning up previous effect");
});

// Subscribe to changes
const unsubscribe = subscribe(
  () => countAtom(),
  (newValue, oldValue) => {
    console.log(`Count changed from ${oldValue} to ${newValue}`);
  }
);

// Clean up when done
cleanup();
unsubscribe();
```

## API Reference

### `atom<T>(initialValue?: T): Atom<T>`

Creates a new atom with an optional initial value.

```typescript
const count = atom(0);
const name = atom("John");
const user = atom({ id: 1, name: "John" });
```

### `computed<T>(selector: () => T): () => T`

Creates a computed value that derives its value from other atoms or computed values.

```typescript
const count = atom(1);
const doubled = computed(() => count() * 2);
```

### `effect(callback: (cleanup: () => void) => (() => void) | void): () => void`

Creates an effect that runs when its dependencies change. The callback can return a cleanup function.

```typescript
const count = atom(0);
const cleanup = effect(() => {
  console.log(`Count changed to ${count()}`);
  return () => console.log("Cleaning up previous run");
});
```

### `subscribe<T>(selector: () => T, listener: (newValue: T, oldValue: T) => void): () => void`

Subscribes to changes in a selector function.

```typescript
const count = atom(0);
const unsubscribe = subscribe(
  () => count(),
  (newValue, oldValue) => {
    console.log(`Count changed from ${oldValue} to ${newValue}`);
  }
);
```

### `batch(callback: () => void): void`

Batches multiple state updates to trigger reactions only once at the end.

```typescript
import { atom, batch } from "value-stores";

const count = atom(0);
const name = atom("John");

batch(() => {
  count(1);
  name("Jane");
  // Listeners will only be notified once after the batch completes
});
```

### `peek<T>(atom: Atom<T>): T`

Reads an atom's value without creating a dependency.

```typescript
import { atom, peek } from "value-stores";

const count = atom(0);
const value = peek(count); // Read without tracking dependency
```

### `isAtom(value: unknown): boolean`

Checks if a value is an atom.

```typescript
import { atom, isAtom } from "value-stores";

const count = atom(0);
console.log(isAtom(count)); // true
console.log(isAtom({})); // false
```

## License

MIT
