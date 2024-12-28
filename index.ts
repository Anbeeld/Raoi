export default class Raoi {
  private static id = 0;
  private static weakRefsSupported: boolean|null = null;
  // @ts-ignore
  private static weakRefs: (WeakRef<Object>|null)[] = [];
  private static strongRefs: (Object|null)[] = [];

  static new(object?: Object) : number {
    Raoi.checkWeakRefsSupport();

    if (Raoi.weakRefsSupported) {
      if (object !== undefined) {
        // @ts-ignore
        Raoi.weakRefs.push(new WeakRef(object));
      } else {
        Raoi.weakRefs.push(null);
      }
    } else {
      if (object !== undefined) {
        Raoi.strongRefs.push(object);
      } else {
        Raoi.strongRefs.push(null);
      }
    }

    return Raoi.id++;
  }

  static get(id: number) : Object|undefined|null {
    if (id > Raoi.id) {
      return null;
    }

    Raoi.checkWeakRefsSupport();

    if (Raoi.weakRefsSupported) {
      if (Raoi.weakRefs[id] === null) {
        return null;
      }
      return Raoi.weakRefs[id].deref();
    } else {
      if (Raoi.strongRefs[id] === null) {
        return null;
      } else if (Raoi.strongRefs[id] === undefined) {
        return undefined;
      }
      return Raoi.strongRefs[id];
    }
  }

  static unregister(id: number) : void {
    if (id > Raoi.id) {
      return;
    }

    if (Raoi.weakRefsSupported) {
      Raoi.weakRefs[id] = null;
    } else {
      Raoi.strongRefs[id] = null;
    }
  }

  private static checkWeakRefsSupport() : void {
    if (Raoi.weakRefsSupported === null) {
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