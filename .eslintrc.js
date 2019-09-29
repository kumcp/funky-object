module.exports = {
    env: {
        es6: true,
        node: true
    },
    extends: ['airbnb-base'],
    // plugins: ['prettier'],
    rules: {
        // 'prettier/prettier': 'error', // Show error from prettier

        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'no-unused-vars': ['warn'],
        'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
        'arrow-parens': ['off'],
        'implicit-arrow-linebreak': 'off',
        'comma-dangle': ['error', 'never']
    }
};
