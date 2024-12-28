# Raoi

Raoi aka Register of Auto-incrementing Object Identificators is a simple TS library allowing to give objects unique ids and later retrieve them by said ids.

Plain old ids from 0 to the Moon, which allows to store object references as an array with fast id -> object search. Uses WeakRef if supported, strong references otherwise.

## Installation

`npm i raoi` or grab [JS dist file](https://github.com/Anbeeld/Raoi/tree/main/dist) from GitHub repo.

## Usage

`import Raoi from 'raoi'` if using npm

`Raoi.new(object?)` returns id and registers object if provided, otherwise pairs id with null.

`Raoi.get(id)` returns null if no object was registered for this id, undefined if object was paired but no longer exists, or the object itself otherwise.
