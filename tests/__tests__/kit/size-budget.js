// A ceiling test: raise the budget before adding text, or cut text before lowering the budget, and the suite never fails.
// Adding: the text first, then the budget. Cutting: the budget first, then the text.

import {
  readFileSync,
} from 'node:fs'
import {
  fileURLToPath,
} from 'node:url'

import KitMarkdownTree from '../../tools/KitMarkdownTree.js'
import KitSizeBudget from '../../tools/KitSizeBudget.js'

describe('kit/**/*.md', () => {
  describe('byte length', () => {
    describe('when every file is measured against size-budget.json', () => {
      test('should stay within its recorded budget', () => {
        const tree = KitMarkdownTree.create({
          rootPath: fileURLToPath(new URL('../../../kit/', import.meta.url)),
        })
        const budgetHash = JSON.parse(
          readFileSync(new URL('../../kit/size-budget.json', import.meta.url), 'utf8')
        )
        const sizeBudget = KitSizeBudget.create({
          tree,
          budgetHash,
        })

        const received = sizeBudget.collectOverruns()

        expect(received)
          .toEqual([])
      })
    })
  })
})
