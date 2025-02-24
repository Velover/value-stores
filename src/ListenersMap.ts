export class ListenersMap {
  private map_ = new Map<() => void, WeakRef<object> | true>();
  private registry_ = new FinalizationRegistry<() => void>((key) => {
    this.map_.delete(key);
  });

  Set(key: () => void, value: object | true): void {
    const existing_value = this.map_.get(key);

    if (existing_value !== undefined && existing_value !== true) {
      this.registry_.unregister(existing_value);
    }

    if (value === true) {
      this.map_.set(key, value);
      return;
    }

    const ref = new WeakRef(value);
    this.registry_.register(value, key, ref);
    this.map_.set(key, ref);
  }

  Delete(key: () => void): void {
    const existing_value = this.map_.get(key);
    this.map_.delete(key);
    if (existing_value === true || existing_value === undefined) return;
    this.registry_.unregister(existing_value);
  }

  GetKeys() {
    const keys: (() => void)[] = [];
    for (const [key] of this.map_) {
      keys.push(key);
    }
    return keys;
  }
}
