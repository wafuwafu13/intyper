export class Environment {
  store: Map<string, any>;

  constructor(store: Map<string, any>) {
    this.store = store;
  }

  get(name: string): any {
    return this.store.get(name);
  }

  set(name: string, val: any): any {
    this.store.set(name, val);
    return val;
  }
}
