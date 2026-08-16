import {
  execFileSync,
} from 'node:child_process'
import {
  readdirSync,
  readFileSync,
} from 'node:fs'
import {
  join,
} from 'node:path'
import {
  fileURLToPath,
} from 'node:url'

const repoRoot = fileURLToPath(new URL('../../../', import.meta.url))
const buildScript = '.claude/skills/flatten/scripts/build.js'
const sourceRoot = join(repoRoot, 'kit')
const outputRoot = join(repoRoot, 'dist')

/**
 * List every file below a directory, as paths relative to it.
 *
 * @param {string} root - Directory to walk.
 * @param {Array<string>} segments - Path segments accumulated so far.
 * @returns {Array<string>} Relative file paths, in directory order.
 */
function listFiles (
  root,
  segments
) {
  const entries = readdirSync(join(root, ...segments), { withFileTypes: true })

  const files = entries
    .filter(it => it.isFile())
    .map(it => [...segments, it.name].join('/'))

  const nested = entries
    .filter(it => it.isDirectory())
    .flatMap(it => listFiles(root, [...segments, it.name]))

  return [
    ...files,
    ...nested,
  ]
}

/**
 * Read the `name:` value declared by a Markdown file.
 *
 * Parsed here rather than imported from the build, so that this stays a check
 * of the build's output and not a comparison of one implementation to itself.
 *
 * @param {string} markdownPath - Path to the Markdown file to read.
 * @returns {string | null} The declared name, or null when absent.
 */
function readDeclaredName (markdownPath) {
  const content = readFileSync(markdownPath, 'utf8')
  const nameMatch = content.match(/^---\n(?:.*\n)*?name:[ \t]*(\S.*?)[ \t]*\n/u)

  return nameMatch === null
    ? null
    : nameMatch[1]
}

const sourceFiles = listFiles(sourceRoot, [])

const skillFolderNames = readdirSync(join(sourceRoot, 'skills'), { withFileTypes: true })
  .filter(it => it.isDirectory())
  .map(it => it.name)

const agentFileNames = readdirSync(join(sourceRoot, 'agents'), { withFileTypes: true })
  .filter(it => it.isFile())
  .map(it => it.name)

/*
 * One build for the whole file. The build itself checks nothing — it copies
 * kit/ into dist/ — so the assertions below are the whole of what holds the
 * layout up. dist/ is gitignored, and a publish rebuilds it from prepack
 * regardless, so rewriting it here costs nothing.
 */
beforeAll(() => {
  execFileSync(
    'node',
    [buildScript],
    { cwd: repoRoot }
  )
})

describe('Build output', () => {
  describe('holds exactly the files kit/ holds', () => {
    test('same paths, nothing added and nothing dropped', () => {
      const actual = listFiles(outputRoot, [])
        .toSorted()
      const expected = sourceFiles
        .toSorted()

      expect(actual)
        .toEqual(expected)
    })
  })

  describe('copies every file byte for byte', () => {
    const cases = sourceFiles
      .map(it => ({ relativePath: it }))

    test.each(cases)('$relativePath', ({ relativePath }) => {
      const actual = readFileSync(join(outputRoot, relativePath))
      const expected = readFileSync(join(sourceRoot, relativePath))

      expect(actual.equals(expected))
        .toBe(true)
    })
  })
})

describe('Installed name', () => {
  describe('every skill declares a name: equal to its folder name', () => {
    const cases = skillFolderNames
      .map(it => ({ folderName: it }))

    test.each(cases)('$folderName', ({ folderName }) => {
      const actual = readDeclaredName(join(outputRoot, 'skills', folderName, 'SKILL.md'))

      expect(actual)
        .toBe(folderName)
    })
  })

  describe('every agent declares a name: equal to its file name', () => {
    const cases = agentFileNames
      .map(it => ({
        fileName: it,
        stem: it.replace(/\.md$/u, ''),
      }))

    test.each(cases)('$fileName', ({ fileName, stem }) => {
      const actual = readDeclaredName(join(outputRoot, 'agents', fileName))

      expect(actual)
        .toBe(stem)
    })
  })
})
