export default class Raoi {
  private static id = 0;
  private static weakRefsSupported: boolean|undefined = undefined;
  // @ts-ignore
  private static weakRefs: (WeakRef<object>|undefined)[] = [];
  private static strongRefs: (object|undefined)[] = [];

  static new(object?: object) : number {
    Raoi.checkWeakRefsSupport();

    if (Raoi.weakRefsSupported) {
      if (object !== undefined) {
        // @ts-ignore
        Raoi.weakRefs.push(new WeakRef(object));
      } else {
        Raoi.weakRefs.push(undefined);
      }
    } else {
      if (object !== undefined) {
        Raoi.strongRefs.push(object);
      } else {
        Raoi.strongRefs.push(undefined);
      }
    }

    return Raoi.id++;
  }

  static get<Type = object>(id: number, type?: { new (...args: any[]): Type }) : Type|undefined {
    if (id > Raoi.id) {
      return undefined;
    }

    Raoi.checkWeakRefsSupport();

    let ref;
    if (Raoi.weakRefsSupported) {
      ref = Raoi.weakRefs[id].deref();
    } else {
      ref = Raoi.strongRefs[id];
    }

    if (type !== undefined && !(ref instanceof type)) {
      return undefined;
    }

    return ref;
  }

  static unregister(id: number) : void {
    if (id > Raoi.id) {
      return;
    }

    if (Raoi.weakRefsSupported) {
      Raoi.weakRefs[id] = undefined;
    } else {
      Raoi.strongRefs[id] = undefined;
    }
  }

  private static checkWeakRefsSupport() : void {
    if (Raoi.weakRefsSupported === undefined) {
      Raoi.weakRefsSupported = true;
      try {
        // @ts-ignore
        new WeakRef(new Object());
      } catch (e) {
        Raoi.weakRefsSupported = false;
      }
    }
  }
}