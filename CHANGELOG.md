## 0.3.0

– Moved register logic into a separate class and changed the structure of the main class accordingly.

– Switched record storage from array to map, with records without object not being stored to minimize memory consumption.

– Allowed to create separate registers that may be configured to only hold objects of a certain class.

– Changed method naming scheme to push() instead of new() for adding object and getting its id, delete() instead of unregister() for removing reference by id, and new() now creates a separate register instead.

– Added set() method to create a record with a reference to an object at a certain id, overwriting if it already exists.

– Added find() method that searches the register for records referencing the object and returns array of their ids sorted ascending, or undefined if there's none.

– Added export() method that returns an object with register data and all its records, as well as import() method that takes result of export() and modifies the register according to it.

– Added type validation of ids, objects and classes with vanilla Javascript usage in mind. Validation fail leads to setting the value to undefined and printing an error in the console.

– Usage of both weak and strong references is now allowed simultaneously in the same register, with weak being default if supported.

## 0.2.3

– Updated naming to non-public being underscored.

– New cross-library webpack minimizing config, resulting in a much smaller dist file.

## 0.2.2

– Can now use abstract classes as get() type argument.

## 0.2.1

– Fixed debug leftovers.

## 0.2.0

– Now uses undefined for all falsy values and returns.

– Added optional type argument to the get() method. If a type is specified, referenced object having some other type results in undefined return, and the function signature changes generic-like to match specified type.

– Reduced memory consumption by not storing pairs until first non-undefined.

## 0.1.0

– Initial release.