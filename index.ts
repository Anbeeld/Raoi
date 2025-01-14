export default class Raoi {
  private static _id = 0;
  private static _startOffset = 0;
  private static _isWeakRefSupported: boolean|undefined = undefined;
  // @ts-ignore
  private static _weakRefs: (WeakRef<object>|undefined)[] = [];
  private static _strongRefs: (object|undefined)[] = [];

  public static new(object?: object) : number {
    if (Raoi._hasWeakRefSupport()) {
      if (object !== undefined) {
        // @ts-ignore
        Raoi._weakRefs.push(new WeakRef(object));
      } else {
        Raoi._weakRefs.push(undefined);
      }
    } else {
      if (object !== undefined) {
        Raoi._strongRefs.push(object);
      } else {
        Raoi._strongRefs.push(undefined);
      }
    }

    Raoi._updateStartOffset();

    return Raoi._id++;
  }

  public static get<Type = object>(_id: number, type?: abstract new (...args: any[]) => Type) : Type|undefined {
    if (_id > Raoi._id || _id < Raoi._startOffset) {
      return undefined;
    }

    let ref;
    if (Raoi._hasWeakRefSupport()) {
      ref = Raoi._weakRefs[-Raoi._startOffset + _id].deref();
    } else {
      ref = Raoi._strongRefs[-Raoi._startOffset + _id];
    }

    if (type !== undefined && !(ref instanceof type)) {
      return undefined;
    }

    return ref;
  }

  public static unregister(_id: number) : void {
    if (_id > Raoi._id || _id < Raoi._startOffset) {
      return;
    }

    if (Raoi._hasWeakRefSupport()) {
      Raoi._weakRefs[-Raoi._startOffset + _id] = undefined;
    } else {
      Raoi._strongRefs[-Raoi._startOffset + _id] = undefined;
    }

    Raoi._updateStartOffset();
  }

  private static _hasWeakRefSupport() : boolean {
    if (Raoi._isWeakRefSupported === undefined) {
      Raoi._isWeakRefSupported = true;
      try {
        // @ts-ignore
        new WeakRef(new Object());
      } catch (e) {
        Raoi._isWeakRefSupported = false;
      }
    }
    return Raoi._isWeakRefSupported;
  }

  private static _updateStartOffset() : void {
    let initialStartOffset = Raoi._startOffset;
    if (Raoi._hasWeakRefSupport()) {
      for (let i = 0; i < Raoi._weakRefs.length; i++) {
        if (Raoi._weakRefs[i] === undefined) {
          Raoi._startOffset += 1;
        } else {
          break;
        }
      }
      if (Raoi._startOffset > initialStartOffset) {
        Raoi._weakRefs = Raoi._weakRefs.slice(Raoi._startOffset - initialStartOffset);
      }
    } else {
      for (let i = 0; i < Raoi._strongRefs.length; i++) {
        if (Raoi._strongRefs[i] === undefined) {
          Raoi._startOffset += 1;
        } else {
          break;
        }
      }
      if (Raoi._startOffset > initialStartOffset) {
        Raoi._strongRefs = Raoi._strongRefs.slice(Raoi._startOffset - initialStartOffset);
      }
    }
  }
}