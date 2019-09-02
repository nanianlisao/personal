// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'semi': 0,
    'no-new': 0,
    'no-unused-vars': 0,
    'indent': 0,
    'object-property-newline': 0,
    'no-undef': 0,
    'no-new': 0,
    'arrow-parens': 0,
    'eol-last': 0,
    'generator-star-spacing': 0,
    'space-before-function-paren': 0,
    'eqeqeq': 0,
    'handle-callback-err': 0,
    "quotes": [0, "double"],
    'no-trailing-spaces': 0,
    'no-callback-literal': 0,
    'vue/no-parsing-error': [2, {
      'x-invalid-end-tag': false
    }],
    'no-extend-native': ['error', { 'exceptions': ['Object'] }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
