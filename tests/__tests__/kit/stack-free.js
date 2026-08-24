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
const sourceRoot = join(repoRoot, 'kit')

/*
 * The kit is a stack-agnostic orchestrator: everything specific to a
 * technology stack lives in the boilerplate's stack handbook (docs/stack/ at
 * a project's root) or in the equipped skills package, and a hora file states
 * only the kind of answer it needs (kit/skills/hora/references/structure.md,
 * "The division of labor"). A stack name written into the kit — even as an
 * example — is a copy that goes stale in silence, so this suite holds the
 * line mechanically: no file under kit/ may mention one.
 *
 * Each entry is a word the kit has no business knowing. Patterns carry word
 * boundaries where the token collides with an ordinary English fragment;
 * "express" is left out entirely because the bare verb is legitimate prose.
 */
const forbiddenTokens = [
  { token: 'renchan', pattern: /renchan/iu },
  { token: 'furo', pattern: /\bfuro\b/iu },
  { token: 'nuxt', pattern: /nuxt/iu },
  { token: 'vue', pattern: /\bvue\b/iu },
  { token: 'graphql', pattern: /graphql/iu },
  { token: 'sdl', pattern: /\bsdl\b/iu },
  { token: 'sequelize', pattern: /sequelize/iu },
  { token: 'mariadb', pattern: /mariadb/iu },
  { token: 'mysql', pattern: /\bmysql\b/iu },
  { token: 'redis', pattern: /\bredis\b/iu },
  { token: 'ioredis', pattern: /ioredis/iu },
  { token: 'bullmq', pattern: /bullmq/iu },
  { token: 'pm2', pattern: /\bpm2\b/iu },
  { token: 'minio', pattern: /\bminio\b/iu },
  { token: 'elasticsearch', pattern: /elasticsearch/iu },
  { token: 'kafka', pattern: /kafka/iu },
  { token: 'qdrant', pattern: /qdrant/iu },
]

/*
 * A deliberate, discussed exception names its file and its token here, one
 * pair per line, with the reason beside it. Empty is the expected state.
 */
const allowedMentions = [
  // { relativePath: 'skills/<skill>/SKILL.md', token: '<token>', reason: '<why>' },
]

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
 * Collect every forbidden mention in one file, as `<token> at line <n>: <line>`.
 *
 * @param {string} relativePath - Path below kit/.
 * @returns {Array<string>} One entry per offending token per line.
 */
function collectMentions (relativePath) {
  const lines = readFileSync(join(sourceRoot, relativePath), 'utf8')
    .split('\n')

  return forbiddenTokens
    .filter(({ token }) =>
      !allowedMentions.some(it =>
        it.relativePath === relativePath
        && it.token === token
      )
    )
    .flatMap(({ token, pattern }) =>
      lines
        .map((line, index) => ({
          line,
          lineNumber: index + 1,
        }))
        .filter(({ line }) => pattern.test(line))
        .map(({ line, lineNumber }) => `${token} at line ${lineNumber}: ${line.trim()}`)
    )
}

describe('Stack-agnostic kit', () => {
  describe('no file under kit/ names a stack', () => {
    const cases = listFiles(sourceRoot, [])
      .map(it => ({ relativePath: it }))

    test.each(cases)('$relativePath', ({ relativePath }) => {
      const actual = collectMentions(relativePath)

      expect(actual)
        .toEqual([])
    })
  })
})
