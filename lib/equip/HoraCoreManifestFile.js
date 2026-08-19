import fs from 'node:fs'
import path from 'node:path'

/**
 * The record of what this package installed into a consuming repository.
 *
 * It exists so that a later run removes exactly what an earlier run wrote, and
 * never one the consuming repository authored itself.
 *
 * One file holds a record per installation directory, keyed by the path the entries
 * were installed into, so that installing into two directories keeps two records
 * instead of one overwriting the other.
 *
 * ```json
 * {
 *   "version": "0.1.0",
 *   "installations": {
 *     ".claude/agents": {
 *       "entryNames": ["hora-verifier.md"]
 *     },
 *     ".claude/skills": {
 *       "entryNames": ["bank-id", "hora-plan"]
 *     }
 *   }
 * }
 * ```
 */
export default class HoraCoreManifestFile {
  /**
   * Constructor.
   *
   * @param {{
   *   filePath: string
   *   installationPath: string
   * }} params - Parameters.
   */
  constructor ({
    filePath,
    installationPath,
  }) {
    this.filePath = filePath
    this.installationPath = installationPath
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof HoraCoreManifestFile ? X : never} T, X
   * @param {{
   *   filePath: string
   *   installationPath: string
   * }} params - Parameters for the factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    filePath,
    installationPath,
  }) {
    return new this({
      filePath,
      installationPath,
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
   * Node path module.
   *
   * @returns {typeof path} Node path module.
   */
  get path () {
    return path
  }

  /**
   * Load the entry names recorded for this installation directory by the previous run.
   *
   * The manifest sits in the consuming repository, so what it holds is not guaranteed to
   * be what a previous run wrote. Anything but an array of strings is read as nothing
   * recorded, and a member that is not a string is dropped from the ones that are.
   *
   * @returns {Array<string>} Recorded entry names, empty when nothing usable is recorded.
   * @public
   */
  loadEntryNames () {
    const entryNames = this.loadInstallation()
      ?.entryNames

    if (!Array.isArray(entryNames)) {
      return []
    }

    return entryNames.filter(it => typeof it === 'string')
  }

  /**
   * Load the entry of this installation directory.
   *
   * @returns {HoraCoreInstallationHash | null} Entry of this installation directory, or null when absent.
   */
  loadInstallation () {
    const installationHash = this.loadInstallationHash()

    return installationHash[this.installationPath]
      ?? null
  }

  /**
   * Load the entries of every installation directory.
   *
   * @returns {Record<string, HoraCoreInstallationHash>} Entries by installation directory, empty when none is readable.
   */
  loadInstallationHash () {
    return this.load()
      ?.installations
      ?? {}
  }

  /**
   * Load the manifest.
   *
   * @returns {HoraCoreManifestHash | null} Manifest hash, or null when absent or unreadable.
   * @public
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

  /**
   * Save the entry of this installation directory, keeping the entries of the others.
   *
   * @param {{
   *   version: string | null
   *   entryNames: Array<string>
   * }} params - Parameters.
   * @returns {void}
   * @public
   */
  save ({
    version,
    entryNames,
  }) {
    this.write({
      manifestHash: {
        version,
        installations: {
          ...this.loadInstallationHash(),
          [this.installationPath]: {
            entryNames,
          },
        },
      },
    })
  }

  /**
   * Write the manifest, creating the directory holding it.
   *
   * @param {{
   *   manifestHash: HoraCoreManifestHash
   * }} params - Parameters.
   * @returns {void}
   */
  write ({
    manifestHash,
  }) {
    const manifestJson = JSON.stringify(
      manifestHash,
      null,
      2
    )

    this.fs.mkdirSync(
      this.path.dirname(this.filePath),
      { recursive: true }
    )

    this.fs.writeFileSync(
      this.filePath,
      `${manifestJson}\n`
    )
  }

  /**
   * Remove the entry of this installation directory, and the file once no entry is left.
   *
   * @returns {void}
   * @public
   */
  remove () {
    const manifestHash = this.load()

    if (!manifestHash) {
      return
    }

    const remainingInstallationHash = this.buildRemainingInstallationHash()

    if (Object.keys(remainingInstallationHash).length === 0) {
      this.fs.rmSync(
        this.filePath,
        { force: true }
      )

      return
    }

    this.write({
      manifestHash: {
        ...manifestHash,
        installations: remainingInstallationHash,
      },
    })
  }

  /**
   * Build the entries left after dropping the one of this installation directory.
   *
   * @returns {Record<string, HoraCoreInstallationHash>} Entries of the other installation directories.
   */
  buildRemainingInstallationHash () {
    return Object.fromEntries(
      Object.entries(this.loadInstallationHash())
        .filter(([installationPath]) => installationPath !== this.installationPath)
    )
  }
}

/**
 * @typedef {{
 *   version: string | null
 *   installations: Record<string, HoraCoreInstallationHash>
 * }} HoraCoreManifestHash
 */

/**
 * @typedef {{
 *   entryNames: Array<string>
 * }} HoraCoreInstallationHash
 */
