module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: [
    '@typescript-eslint',
    'react',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    '@typescript-eslint/no-shadow': 'error',
    'react-native/no-inline-styles': 0,
    'eqeqeq': [
      'error',
      'always',
      {
        'null': 'ignore'
      }
    ],
    'jest/no-identical-title': 'off',
    'no-else-return': 'error',
    'no-shadow': 'off',
    'no-undef': 'error',
    'no-useless-rename': 'error',
    'object-shorthand': 'error',
    'one-var': [
      'error',
      'never'
    ],
    'no-extra-semi': 'off',
    'semi': 'off',
    'padding-line-between-statements': [
      'error',
      {
        'blankLine': 'always',
        'next': 'return',
        'prev': '*'
      },
      {
        'blankLine': 'always',
        'next': '*',
        'prev': [
          'const',
          'let',
          'var',
          'block',
          'block-like'
        ]
      },
      {
        'blankLine': 'any',
        'next': [
          'const',
          'let',
          'var'
        ],
        'prev': [
          'const',
          'let',
          'var'
        ]
      }
    ],
    'prefer-const': [
      'error',
      {
        'ignoreReadBeforeAssign': false
      }
    ],
    'react-hooks/exhaustive-deps': 1,
    'react-hooks/rules-of-hooks': 1,
    'react/destructuring-assignment': 1,
    'react/jsx-filename-extension': [
      1,
      {
        'extensions': [
          '.js',
          '.jsx',
          '.tsx'
        ]
      }
    ],
    'react/jsx-fragments': [
      'error',
      'syntax'
    ],
    'react/jsx-key': 1,
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-undef': 1,
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-sort-props': 'error',
    'react/no-invalid-html-attribute': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/self-closing-comp': 'error',
  },
  'globals': {
    'JSX': 'readonly'
  },
  'overrides': [
    {
      'files': 'server/**/*.js',
      'rules': {
        'import/order': [
          'error',
          {
            'newlines-between': 'always'
          }
        ]
      }
    }
  ],
  'env': {
    'jasmine': true,
    'jest': true,
    'browser': true
  }
};
