import fs from 'node:fs'
import path from 'node:path'

/**
 * The package.json of the repository that installed this package.
 *
 * It is read to tell that repository apart from this package itself, whose own
 * `npm install` fires the same `postinstall`.
 */
export default class ConsumerPackageConfig {
  /**
   * Constructor.
   *
   * @param {{
   *   filePath: string
   * }} params - Parameters.
   */
  constructor ({
    filePath,
  }) {
    this.filePath = filePath
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof ConsumerPackageConfig ? X : never} T, X
   * @param {{
   *   directoryPath: string
   * }} params - Parameters for the factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    directoryPath,
  }) {
    return new this({
      filePath: path.join(
        directoryPath,
        'package.json'
      ),
    })
  }

  /**
   * Node file system module.
   *
   * @returns {typeof fs} Node file system module.
   */
  get fs () {
    return fs
  }

  /**
   * Extract the package name the consuming repository declares.
   *
   * @returns {string | null} Package name, or null when nothing is declared.
   * @public
   */
  extractName () {
    return this.load()
      ?.name
      ?? null
  }

  /**
   * Load the package.json of the consuming repository.
   *
   * @returns {{
   *   name?: string
   * } | null} Package hash, or null when absent or unreadable.
   */
  load () {
    if (!this.fs.existsSync(this.filePath)) {
      return null
    }

    try {
      return JSON.parse(
        this.fs.readFileSync(
          this.filePath,
          'utf8'
        )
      )
    } catch {
      return null
    }
  }
}
