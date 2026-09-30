import {
  fileURLToPath,
} from 'node:url'

import KitLinkInspector from '../../tools/KitLinkInspector.js'
import KitMarkdownTree from '../../tools/KitMarkdownTree.js'

describe('kit/**/*.md', () => {
  describe('relative links', () => {
    describe('when every file is read', () => {
      test('should reach an existing path inside the kit', () => {
        const tree = KitMarkdownTree.create({
          rootPath: fileURLToPath(new URL('../../../kit/', import.meta.url)),
        })
        const inspector = KitLinkInspector.create({
          tree,
        })

        const received = inspector.collectUnresolvedLinks()

        expect(received)
          .toEqual([])
      })
    })
  })
})
