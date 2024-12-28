export default class Raoi {
  private static id = 0;
  private static startOffset = 0;
  private static weakRefSupported: boolean|undefined = undefined;
  // @ts-ignore
  private static weakRefs: (WeakRef<object>|undefined)[] = [];
  private static strongRefs: (object|undefined)[] = [];

  static new(object?: object) : number {
    if (Raoi.hasWeakRefSupport()) {
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

    Raoi.updateStartOffset();

    return Raoi.id++;
  }

  static get<Type = object>(id: number, type?: { new (...args: any[]): Type }) : Type|undefined {
    if (id > Raoi.id || id < Raoi.startOffset) {
      return undefined;
    }

    let ref;
    if (Raoi.hasWeakRefSupport()) {
      ref = Raoi.weakRefs[-Raoi.startOffset + id].deref();
    } else {
      ref = Raoi.strongRefs[-Raoi.startOffset + id];
    }

    if (type !== undefined && !(ref instanceof type)) {
      return undefined;
    }

    return ref;
  }

  static unregister(id: number) : void {
    if (id > Raoi.id || id < Raoi.startOffset) {
      return;
    }

    if (Raoi.hasWeakRefSupport()) {
      Raoi.weakRefs[-Raoi.startOffset + id] = undefined;
    } else {
      Raoi.strongRefs[-Raoi.startOffset + id] = undefined;
    }

    Raoi.updateStartOffset();
  }

  private static hasWeakRefSupport() : boolean {
    if (Raoi.weakRefSupported === undefined) {
      Raoi.weakRefSupported = true;
      try {
        // @ts-ignore
        new WeakRef(new Object());
      } catch (e) {
        Raoi.weakRefSupported = false;
      }
    }
    return Raoi.weakRefSupported;
  }

  private static updateStartOffset() : void {
    let initialStartOffset = Raoi.startOffset;
    if (Raoi.hasWeakRefSupport()) {
      for (let i = 0; i < Raoi.weakRefs.length; i++) {
        if (Raoi.weakRefs[i] === undefined) {
          Raoi.startOffset += 1;
        } else {
          break;
        }
      }
      if (Raoi.startOffset > initialStartOffset) {
        Raoi.weakRefs = Raoi.weakRefs.slice(Raoi.startOffset - initialStartOffset);
      }
    } else {
      for (let i = 0; i < Raoi.strongRefs.length; i++) {
        if (Raoi.strongRefs[i] === undefined) {
          Raoi.startOffset += 1;
        } else {
          break;
        }
      }
      if (Raoi.startOffset > initialStartOffset) {
        Raoi.strongRefs = Raoi.strongRefs.slice(Raoi.startOffset - initialStartOffset);
      }
    }
  }
}