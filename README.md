# funky-promisify

A simple module to help you to tranform a function in callback style to promise style and vice versa

# Using

## 1. Object handling

### Filter

```
const object = {
    a: 1,
    b: 2,
    c: 3
};

const objFiltered = ObjectTransform.objectFilter(
    object,
    (key, val) => val > 2   // Key will always be a string
);

objFiltered; // => { c: 3 }

```

If you want to filter a list of keys, then, you can use `objectFilterByKeys`:

```
const object = {
    a: 1,
    b: 2,
    c: 3
};

const objFiltered = ObjectTransform.objectFilterByKeys(
    object,
    ['a','c']
);

objFiltered; // => { a: 1, c: 3 }
```

## 2. List handling

## 3. Callbackify

```
const {
    Function: { callbackify, promisify }
} = require("funky-object")


let functionWithCallback = function(){}
let functionPromise = promisify(functionWithCallback, { type: 2 })

// Start using functionPromise as Promise style.

let functionPromise = () => Promise.resolve()
let functionWithCallback = callbackify(functionPromise, {})

// Start using functionWithCallback as Callback style.
// See internal doc for more options.
```
