# funky-promisify

A simple module to help you to tranform a function in callback style to promise style and vice versa

# Using

## 1. Object handling

### 1.1 Filter

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

### 1.2 Modify object

## 2. List handling

(updating)

## 3. CSV Object handling

CSV format:

```
id,name,age,job                     <- header
1,Kum,24,programmer                 <- item number 0
2,Kurl,25,coder                     <- item number 1
3,"Karl, Markian",26,designer       <- item number 2
```

CSV string cannot have this set of special characters: `",`
It will make the parser run not correctly

### 3.1 Read CSV file to object

```
const { CSV } = require("funky-object")

const csvFilePath = `./file.csv`

const objectList = await CSV.readObjectList(csvFilePath);

/*
-> objectList = [
    {id: '1', name: 'Kum', age: '24', job: 'programmer'},       // No parsing number into Integer
    {id: '2', name: 'Kurl', age: '25', job: 'coder'},
    {id: '3', name: 'Karl, Markian', age: '26', job: 'designer'}
]
*/

const lineList = await CSV.readLineList(csvFilePath);
/*
 -> lineList = [
    "id,name,age,job",
    "1,Kum,24,programmer",
    "2,Kurl,25,coder",
    "3,"Karl, Markian",26,designer",
    ]
*/
```

## 4. Function modification (include callbackify/promissify)

### 4.1 Callbackify / Promisify

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

### 4.2 Decorate function

```

```
