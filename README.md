[![NPM](https://img.shields.io/npm/v/raoi?label=NPM)](https://www.npmjs.com/package/raoi)

# Raoi

Raoi aka Register of Auto-incrementing Object Identificators is a simple TS library allowing to give objects unique ids and later retrieve them by said ids.

Plain old ids from 0 to the Moon, which allows to store object references as an array with fast id ‑> object search. Uses WeakRef if supported, strong references otherwise.

[![Support my work!](https://raw.githubusercontent.com/Anbeeld/Anbeeld.github.io/refs/heads/main/support/button.jpg)](https://anbeeld.github.io/support/)

## Installation

`npm i raoi` or grab [JS dist file](https://github.com/Anbeeld/Raoi/tree/main/dist) from GitHub repo.

## Usage

`import Raoi from 'raoi'` if using npm

`Raoi.new(object?)` returns id and registers object if provided, otherwise pairs id with undefined.

`Raoi.get(id, type?)` returns undefined if no object was registered for this id or it no longer exists, or the object itself otherwise. If a type is specified, referenced object having some other type results in undefined return as well, and the function signature changes generic-like to match specified type.

`Raoi.unregister(id)` removes reference to an object with specified id, but the id itself still can't be reused.
