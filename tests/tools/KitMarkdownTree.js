import fs from 'node:fs'
import path from 'node:path'

/**
 * Markdown files below one directory, read from disk.
 */
export default class KitMarkdownTree {
  /**
   * Constructor.
   *
   * @param {{
   *   rootPath: string
   * }} params - Parameters.
   */
  constructor ({
    rootPath,
  }) {
    this.rootPath = rootPath
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof KitMarkdownTree ? X : never} T, X
   * @param {{
   *   rootPath: string
   * }} params - Parameters for the factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    rootPath,
  }) {
    return new this({
      rootPath,
    })
  }

  /**
   * get: fs
   *
   * @returns {typeof fs} Node file system module.
   */
  get fs () {
    return fs
  }

  /**
   * get: path
   *
   * @returns {typeof path} Node path module.
   */
  get path () {
    return path
  }

  /**
   * List every Markdown file below the root, as sorted paths relative to it.
   *
   * @returns {Array<string>} Relative paths, separated by `/`.
   * @public
   */
  listRelativePaths () {
    return this.fs.readdirSync(this.rootPath, { recursive: true })
      .map(it => String(it)
        .split(this.path.sep)
        .join('/'))
      .filter(it => it.endsWith('.md'))
      .toSorted()
  }

  /**
   * Read one file below the root.
   *
   * @param {{
   *   relativePath: string
   * }} params - Parameters.
   * @returns {string} File content.
   * @public
   */
  readContent ({
    relativePath,
  }) {
    return this.fs.readFileSync(
      this.path.join(this.rootPath, relativePath),
      'utf8'
    )
  }

  /**
   * Measure one file below the root in bytes.
   *
   * @param {{
   *   relativePath: string
   * }} params - Parameters.
   * @returns {number} Byte length.
   * @public
   */
  measureByteLength ({
    relativePath,
  }) {
    return this.fs.statSync(this.path.join(this.rootPath, relativePath))
      .size
  }

  /**
   * Resolve a link target written in one file, dropping its anchor.
   *
   * @param {{
   *   relativePath: string
   *   target: string
   * }} params - Parameters.
   * @returns {string} Absolute path.
   * @public
   */
  resolveTarget ({
    relativePath,
    target,
  }) {
    const [filePart] = target.split('#')

    return this.path.resolve(
      this.rootPath,
      this.path.dirname(relativePath),
      filePart
    )
  }

  /**
   * Tell whether an absolute path lies below the root.
   *
   * @param {{
   *   absolutePath: string
   * }} params - Parameters.
   * @returns {boolean} true when inside the root.
   * @public
   */
  contains ({
    absolutePath,
  }) {
    const relativePath = this.path.relative(this.rootPath, absolutePath)

    return relativePath !== '..'
      && !relativePath.startsWith(`..${this.path.sep}`)
  }

  /**
   * Tell whether an absolute path exists.
   *
   * @param {{
   *   absolutePath: string
   * }} params - Parameters.
   * @returns {boolean} true when it exists.
   * @public
   */
  exists ({
    absolutePath,
  }) {
    return this.fs.existsSync(absolutePath)
  }
}
