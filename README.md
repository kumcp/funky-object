# funky-promisify

A simple module to help you to tranform a function in callback style to promise style and vice versa

# Using

```
const { promisify, callbackify } = require("funky-promisify")

let functionWithCallback = function(){}
let functionPromise = promisify(functionWithCallback, { type: 2 })

// Start using functionPromise as Promise style.

let functionPromise = () => Promise.resolve()
let functionWithCallback = callbackify(functionPromise, {})

// Start using functionWithCallback as Callback style.
// See doc for more option.
```
