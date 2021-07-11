export class Environment {
  store: Map<string, any>;
  outer: Environment;

  constructor(store: Map<string, any>, outer: any = null) {
    this.store = store;
    this.outer = outer;
  }

  newEnclosedEnvironment(outer: Environment): Environment {
    const store = new Map<string, any>();

    const env = new Environment(store);
    env.outer = outer;
    return env;
  }

  get(name: string): any {
    const obj = this.store.get(name);
    if (!obj && this.outer != null) {
      return this.outer.get(name);
    }

    return obj;
  }

  set(name: string, val: any): any {
    this.store.set(name, val);
    return val;
  }
}
