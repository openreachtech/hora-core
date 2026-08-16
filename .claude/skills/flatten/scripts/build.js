import {
  cpSync,
  rmSync,
} from 'node:fs'
import {
  join,
} from 'node:path'
import {
  fileURLToPath,
} from 'node:url'

const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url))
const sourceRoot = join(repoRoot, 'kit')
const outputRoot = join(repoRoot, 'dist')

/*
 * dist/ is deleted outright rather than written over: it is a function of the
 * current kit/ alone. Without the deletion, a skill renamed or removed at the
 * source would keep its stale folder in dist/ indefinitely, and every publish
 * would go on shipping a skill that no longer exists — a failure invisible in
 * a diff, because nothing about the stale folder changes.
 */
rmSync(outputRoot, { recursive: true, force: true })

cpSync(
  sourceRoot,
  outputRoot,
  { recursive: true }
)

process.stdout.write(`Copied kit/ into ${outputRoot}\n`)
