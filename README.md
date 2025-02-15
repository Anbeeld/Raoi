[![NPM](https://img.shields.io/npm/v/raoi?label=NPM)](https://www.npmjs.com/package/raoi)

# Raoi

Raoi aka Register of Auto-incrementing Object Identifiers is a simple TS library allowing to give objects unique ids and later retrieve them by said ids. Supports multiple ways to achieve type safety even with vanilla Javascript.

Plain old ids from 0 to the Moon, with both WeakRef (if supported) and strong references on a per record basis.

No matter if it's just a few objects or an interlinked horde of them, Raoi comes in handy. Hundreds of records and thousands of their child records? Fetch them in both directions, from parent to child and vice versa, using ids instead of references, avoiding circular dependencies and the need to import type declarations.

[![Support my work!](https://raw.githubusercontent.com/Anbeeld/Anbeeld.github.io/refs/heads/main/support/button.jpg)](https://anbeeld.github.io/support/)

## Features

- Assign >=0 integer ids to objects and keep weak or strong references to each of them in a global register, allowing you to easily fetch the objects later.

- Use ids instead of references to avoid circular dependencies and freely juggle the object between different classes and files, as only in the destination point you would need to import its type declaration.

- Ensure type safety by providing class declaration to get(id, class?) method of the global register, which will return undefined if the object referenced by that id is not a instance of provided class.

- Create local registers with optional type safety by providing class declaration, which will require all the objects in the register to be instances of it, and make them global if you'd like to by referencing them in the main register.

- Modify the register the way you want to: push and set, get and find, export and import, and of cource delete.

## Installation

`npm i raoi` or grab [JS dist file](https://github.com/Anbeeld/Raoi/tree/main/dist) from GitHub repo.

## Usage

`import Raoi from 'raoi'` if using npm

`Raoi.push(object?, isStrongRef? = false)` returns id and registers the object if provided.

`Raoi.set(object, id, isStrongRef? = false)` registers the object at required id. Returns true if successful, false otherwise.

`Raoi.get(id, class?)` returns undefined if no object was registered for this id or it no longer exists, or the object itself otherwise. If a class is specified, referenced object having some other type results in undefined return as well, and the function signature changes generic-like to match specified class.

`Raoi.find(object)` searches the register for records with references of the object and returns array of their ids, or undefined if there's none of them.

`Raoi.delete(id)` removes the record with the id.

`Raoi.export()` return the register data and all its records in a form of object.

`Raoi.import(exportResult, updateIndex?)` receives the result of export and modifies the register according to it.

`Raoi.new(class?)` creates a new local register. If class is provided, all the objects in the register will be required to be instances of it. You can make it globally available by adding it into the main register.

You can also apply all the same methods to local registers, e.g. `let register = Raoi.new(); register.push(someObject, true);`

If you would like to ensure type safety while adding or fetching one register within another, Raoi class declaration required to do so is always available with `Raoi.class`, e.g. `Raoi.get(27, Raoi.class)`
