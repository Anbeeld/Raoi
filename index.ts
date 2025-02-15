type ExportedRecord<Type> = {id: number, reference: 'strong'|'weak', object: Type};
type ExportedRegister<Type> = {type: any, index: number, records: ExportedRecord<Type>[]};

function isTypeValid(type: any) : boolean {
  if (!(typeof type === 'function' && /^\s*class\s+/.test(type.toString()))) {
    console.error(`Raoi error: Register type must be a class declaration`);
    return false;
  }
  return true;
}

class Register<Type> {
  private _index = -1;

  // Constructor of Type to check incoming and outcoming objects to be instance of it
  private _type: object|undefined = undefined;

  // Checks once and saves the result to a property for consistency and performance
  private _isWeakRefSupported: boolean|undefined = undefined;

  // All records with information about index, reference and object
  // First number in value is reference type: 0 for strong, 1 for weak
  // @ts-ignore so it doesn't complain about WeakRef unsupported
  private _records = new Map<number, [number, Type|WeakRef<Type>|undefined]>();

  public constructor(type: (abstract new (...args: any[]) => Type)|undefined = undefined) {
    if (type !== undefined && isTypeValid(type)) {
      this._type = type;
    }
  }

  private _isObjectValid(object: Type|undefined) : boolean {
    if (object === undefined) {
      return true;
    }
    if (typeof object !== 'object' || Array.isArray(object) || object === null) {
      console.error(`Raoi error: Register can only hold objects, but variable was of type '${object === null ? 'null' : typeof object}'`);
      return false;
    }
    if (this._type !== undefined && !(object instanceof (this._type as any)/* TODO */)) {
      console.error(`Raoi error: Register can only hold objects of type '${this._type.toString().substring(0, this._type.toString().indexOf(" {"))}', but object was of type '${object.constructor.name}'`);
      return false;
    }
    return true;
  }

  private _isIdValid(id: any) : boolean {
    if (typeof id !== 'number' || id < 0 || (id | 0) !== id) {
      console.error(`Raoi error: id '${id}' is not valid, must be integer >= 0`);
      return false;
    }
    return true;
  }

  private _isRecordValid(record: any) : boolean {
    if (Array.isArray(record) && record.length === 2 && (record[0] === 0 || record[0] === 1) && record[1]) {
      return true;
    }
    return false;
  }

  private _modify(object: Type|undefined, id: number, isStrongRef: boolean) : boolean {
    if (object !== undefined) {
      if (isStrongRef || !this._hasWeakRefSupport()) {
        this._records.set(id, [0, object]);
      } else {
        // @ts-ignore so it doesn't complain about WeakRef unsupported
        this._records.set(id, [1, new WeakRef(object)]);
      }
      return true;
    }
    return false;
  }

  public _push(object: Type|undefined = undefined, isStrongRef: boolean = false) : number {
    if (!this._isObjectValid(object)) {
      object = undefined;
    }
    this._modify(object, ++this._index, isStrongRef);
    return this._index;
  }

  public _set(object: Type, id: number, isStrongRef: boolean = false) : boolean {
    if (!this._isObjectValid(object)) {
      return false;
    }
    if (!this._isIdValid(id)) {
      return false;
    }
    if (id > this._index) {
      this._index = id;
    }
    this._modify(object, id, isStrongRef);
    return true;
  }

  public _get(id: number) : Type|undefined {
    if (this._isIdValid(id)) {
      let record = this._records.get(id);
      if (record) {
        if (this._isRecordValid(record)) {
          let object = record[0] === 0 ? record[1] : record[1].deref();
          if (this._isObjectValid(object)) {
            return object;
          }
        } else {
          this._records.delete(id);
        }
      }
    }
    return undefined;
  }

  public _find(object: Type) : number[]|undefined {
    if (this._isObjectValid(object)) {
      let ids: number[] = [];
      for (let [id, record] of this._records.entries()) {
        if (this._isRecordValid(record)) {
          if (object === (record[0] === 0 ? record[1] : record[1].deref())) {
            ids.push(id);
          }
        } else {
          this._records.delete(id);
        }
      }
      if (ids.length) {
        return ids.sort(function(a, b) {
          return a - b;
        });
      }
    }
    return undefined;
  }

  public _delete(id: number) : boolean {
    if (!this._isIdValid(id)) {
      return false;
    }
    return this._records.delete(id);
  }

  private _hasWeakRefSupport() : boolean {
    if (this._isWeakRefSupported === undefined) {
      this._isWeakRefSupported = true;
      try {
        // @ts-ignore so it doesn't complain about WeakRef unsupported
        new WeakRef(new Object());
      } catch (e) {
        this._isWeakRefSupported = false;
      }
    }
    return this._isWeakRefSupported;
  }

  public _export() : ExportedRegister<Type> {
    let records: ExportedRecord<Type>[] = [];
    for (let [id, record] of this._records.entries()) {
      if (this._isRecordValid(record)) {
        records.push({
          id: id,
          reference: record[0] === 0 ? 'strong' : 'weak',
          object: record[0] === 0 ? record[1] : record[1].deref()
        });
      } else {
        this._records.delete(id);
      }
    }
    return {
      type: this._type,
      index: this._index,
      records: records
    };
  }

  public _import(exportResult: ExportedRegister<Type>, updateIndex: boolean = true) : boolean {
    if (!isTypeValid(exportResult.type) || exportResult.type !== this._type) {
      return false;
    }
    if (!this._isExportedRegisterValid(exportResult)) {
      return false;
    }
    if (updateIndex && exportResult.index > this._index) {
      this._index = exportResult.index;
    }
    for (let record of exportResult.records) {
      if (this._isExportedRecordValid(record)) {
        this._set(record.object, record.id, record.reference === 'strong' ? true : false);
      }
    }
    return true;
  }

  private _isExportedRegisterValid(exportResult: any) : boolean {
    if (exportResult.hasOwnProperty('index') && this._isIdValid(exportResult.index)
        && exportResult.hasOwnProperty('records') && Array.isArray(exportResult.records)) {
      return true;
    }
    return false;
  }

  private _isExportedRecordValid(record: any) : boolean {
    if (record.hasOwnProperty('id') && this._isIdValid(record.id)
        && record.hasOwnProperty('reference') && (record.reference === 'strong' || record.reference === 'weak')
        && record.hasOwnProperty('object') && this._isObjectValid(record.object)) {
      return true;
    }
    return false;
  }
}

class Raoi<Type> {
  public static global = new Raoi<object>();
  public get class() { return Raoi; }

  // Global register as static property of exported class
  private _register: Register<Type> = new Register<Type>();

  private constructor(type: (abstract new (...args: any[]) => Type)|undefined = undefined) {
    this._register = new Register<Type>(type);
  }

  // Create new register with the ability to specify allowed type
  public new<RequiredType>(type: (abstract new (...args: any[]) => RequiredType)|undefined = undefined) : Raoi<RequiredType> {
    return new Raoi<RequiredType>(type);
  }

  public push(object: Type|undefined = undefined, isStrongRef: boolean = false) : number {
    return this._register!._push(object, isStrongRef);
  }

  public set(object: Type, id: number, isStrongRef: boolean = false) : boolean {
    return this._register._set(object, id, isStrongRef);
  }

  public get<RequiredType = Type>(id: number, type: (abstract new (...args: any[]) => RequiredType)|undefined = undefined) : RequiredType|undefined {
    let record = this._register._get(id);
    if (!record || (type !== undefined && (!isTypeValid(type) || !(record instanceof type)))) {
      return undefined;
    }
    return record as RequiredType/* TODO ? */;
  }

  public find(object: Type) : number[]|undefined {
    return this._register._find(object);
  }

  public delete(id: number) : boolean {
    return this._register._delete(id);
  }

  public export() : ExportedRegister<Type> {
    return this._register._export();
  }

  public import(exportResult: ExportedRegister<Type>, updateIndex: boolean = true) : boolean {
    return this._register._import(exportResult, updateIndex);
  }
}

export default Raoi.global;