import Raoi from '../index.js';

class A { get A() { return 'A'; } };
class B { get B() { return 'D'; } };
class C { get C() { return 'C'; } };
class D extends C { get D() { return 'D'; } };

let objA = new A();
let objB = new B();
let objD = new D();

console.log('Push 4 ids without references; then 3 ids with references to objects A, B, D; then 4 ids without references');
Raoi.push();
Raoi.push();
Raoi.push();
Raoi.push();
let idA = Raoi.push(objA);
let idB = Raoi.push(objB, true);
let idD = Raoi.push(objD);
Raoi.push();
Raoi.push();
Raoi.push();
Raoi.push();

console.log(`Get records by: ` +
  `id A - ${Raoi.get(idA) ? 'object ' + Raoi.get(idA)?.constructor.name : 'undefined'}, ` +
  `id B - ${Raoi.get(idB) ? 'object ' + Raoi.get(idB)?.constructor.name : 'undefined'}, ` +
  `id D and class B - ${Raoi.get(idD, B) ? 'object ' + Raoi.get(idD, B)?.constructor.name : 'undefined'}, ` +
  `id D and class C - ${Raoi.get(idD, C) ? 'object ' + Raoi.get(idD, C)?.constructor.name : 'undefined'}, ` +
  `id D and class D - ${Raoi.get(idD, D) ? 'object ' + Raoi.get(idD, D)?.constructor.name : 'undefined'}`
);

Raoi.set(objA, 9);
Raoi.set(objB, 192);
console.log(`Set object A to id 9, object B to id 192, then find ids by record: ` +
  `id A - ${Raoi.find(objA)}, ` +
  `id B - ${Raoi.find(objB)}, ` +
  `id D - ${Raoi.find(objD)}`
);

console.log('--------------');

console.log('Delete records by ids A and B');
Raoi.delete(idA);
Raoi.delete(idB);

console.log(`Get records by: ` +
  `id A - ${Raoi.get(idA) ? 'object ' + Raoi.get(idA)?.constructor.name : 'undefined'}, ` +
  `id B - ${Raoi.get(idB) ? 'object ' + Raoi.get(idB)?.constructor.name : 'undefined'}, ` +
  `id D and class B - ${Raoi.get(idD, B) ? 'object ' + Raoi.get(idD, B)?.constructor.name : 'undefined'}, ` +
  `id D and class C - ${Raoi.get(idD, C) ? 'object ' + Raoi.get(idD, C)?.constructor.name : 'undefined'}, ` +
  `id D and class D - ${Raoi.get(idD, D) ? 'object ' + Raoi.get(idD, D)?.constructor.name : 'undefined'}`
);

console.log('--------------');

console.log('Create register for class E');
class E { get E() { return 'E'; } };
class F { get F() { return 'F'; } };

let objE = new E();
let objF = new F();

let registerE = Raoi.new(E);

let idE = registerE.push(objE, true);
let idF = registerE.push(objF);

console.log('Create register for class but actually function G');
class G { get G() { return 'G'; } };
let objG = new G();
let registerG = Raoi.new(G.G);
let idG = registerG.push(objG);

console.log(`Get records by: ` +
  `id E - ${registerE.get(idE) ? 'object ' + registerE.get(idE)?.constructor.name : 'undefined'}, ` +
  `id F - ${registerE.get(idF) ? 'object ' + registerE.get(idF)?.constructor.name : 'undefined'}, ` +
  `id G - ${registerG.get(idG) ? 'object ' + registerG.get(idG)?.constructor.name : 'undefined'}`
);

let registerImported = Raoi.new(E);
registerImported.import(registerE.export());
let objH = new E();
let idH = registerImported.push(objH);

console.log(`Create new register and import previous into it, push one more object, then getting records by: ` +
  `id E - ${registerImported.get(idE) ? 'object ' + registerImported.get(idE)?.constructor.name : 'undefined'}, ` +
  `id F - ${registerImported.get(idF) ? 'object ' + registerImported.get(idF)?.constructor.name : 'undefined'}, ` +
  `id H - ${registerImported.get(idH) ? 'object ' + registerImported.get(idH)?.constructor.name : 'undefined'}`
);