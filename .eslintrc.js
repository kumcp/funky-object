module.exports = {
    env: {
        browser: true,
        es6: true,
        amd: true,
        node: true
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: 2016
    },
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "never"],
        "no-unused-vars": ["warn"],
        "func-style": ["error", "declaration", { allowArrowFunctions: true }]
    }
}
