import {
  default as openreachtechConfig,
  coreRuleOptionHash,
} from '@openreachtech/eslint-config'

export default [
  ...openreachtechConfig,

  {
    ignores: [
      './dist/**',
    ],
  },

  {
    files: [
      'tests/**/*.js',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        // There are 0 or more rest parameters in the array
        // string | { selector: string, message: string }
        ...coreRuleOptionHash['no-restricted-syntax'].spreadOptions
          .filter(it => it.selector !== 'ClassDeclaration[superClass=null]:not(:has(MethodDefinition[kind=constructor])), ClassDeclaration[superClass=null]:has(MethodDefinition[kind=constructor]):not(:has(MethodDefinition[kind=constructor] AssignmentExpression[left.object.type=ThisExpression]))'), // Kick out `Do not declare static class`
      ],

      'jsdoc/require-jsdoc': 'off',
    },
  },
]
