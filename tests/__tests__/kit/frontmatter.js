import {
  fileURLToPath,
} from 'node:url'

import KitFrontmatterInspector from '../../tools/KitFrontmatterInspector.js'
import KitMarkdownTree from '../../tools/KitMarkdownTree.js'

describe('kit/**/*.md', () => {
  describe('frontmatter', () => {
    describe('when every skill and agent is read', () => {
      test('should hold only keys and values Claude Code reads as written', () => {
        const tree = KitMarkdownTree.create({
          rootPath: fileURLToPath(new URL('../../../kit/', import.meta.url)),
        })
        const inspector = KitFrontmatterInspector.create({
          tree,
        })

        const received = inspector.collectViolations()

        expect(received)
          .toEqual([])
      })
    })
  })
})
