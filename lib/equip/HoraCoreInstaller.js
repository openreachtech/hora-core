import fs from 'node:fs'
import path from 'node:path'

import HoraCoreManifestFile from './HoraCoreManifestFile.js'

/**
 * Installer that copies one distributed payload into a consuming repository.
 *
 * A payload is a directory of `dist/` — `agents/`, `skills/` — and one installer carries
 * one of them into the directory of the same name under the consuming repository's
 * `.claude/`. The payload directory itself is never removed, only merged into, so what
 * another package installed there and what the repository authored itself both survive.
 *
 * Inside it, one run replaces what the previous run wrote: the entries recorded in the
 * manifest, along with the ones named after something this package distributes, are
 * removed first, then the current entries are copied and recorded again.
 *
 * An entry named after nothing this package distributes, and recorded by no previous run,
 * is never removed — that is what keeps a skill the consuming repository authored out of
 * the way of an installation, including the very first one.
 */
export default class HoraCoreInstaller {
  /**
   * Constructor.
   *
   * @param {{
   *   sourceDirectoryPath: string
   *   targetDirectoryPath: string
   *   manifestFile: HoraCoreManifestFile
   * }} params - Parameters.
   */
  constructor ({
    sourceDirectoryPath,
    targetDirectoryPath,
    manifestFile,
  }) {
    this.sourceDirectoryPath = sourceDirectoryPath
    this.targetDirectoryPath = targetDirectoryPath
    this.manifestFile = manifestFile
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof HoraCoreInstaller ? X : never} T, X
   * @param {{
   *   workingDirectoryPath: string
   *   sourceDirectoryPath: string
   *   targetDirectoryPath: string
   * }} params - Parameters for the factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    workingDirectoryPath,
    sourceDirectoryPath,
    targetDirectoryPath,
  }) {
    const manifestFile = this.createHoraCoreManifestFile({
      workingDirectoryPath,
      targetDirectoryPath,
    })

    return new this({
      sourceDirectoryPath,
      targetDirectoryPath,
      manifestFile,
    })
  }

  /**
   * Constructor of the manifest file.
   *
   * @returns {typeof HoraCoreManifestFile} Constructor of the manifest file.
   */
  static get HoraCoreManifestFileCtor () {
    return HoraCoreManifestFile
  }

  /**
   * Path segments of the manifest, relative to the working directory.
   *
   * The manifest belongs to this package rather than to Claude Code, so it is kept
   * out of the installation directory and placed under a directory of its own.
   *
   * @returns {Array<string>} Path segments of the manifest.
   */
  static get manifestPathSegments () {
    return [
      '.hora',
      'equip-core.json',
    ]
  }

  /**
   * Create the manifest file recording the installation into the target directory.
   *
   * @param {{
   *   workingDirectoryPath: string
   *   targetDirectoryPath: string
   * }} params - Parameters.
   * @returns {HoraCoreManifestFile} Manifest file of the working directory.
   */
  static createHoraCoreManifestFile ({
    workingDirectoryPath,
    targetDirectoryPath,
  }) {
    return this.HoraCoreManifestFileCtor.create({
      filePath: path.join(
        workingDirectoryPath,
        ...this.manifestPathSegments
      ),
      installationPath: this.buildInstallationPath({
        workingDirectoryPath,
        targetDirectoryPath,
      }),
    })
  }

  /**
   * Build the key an installation is recorded under.
   *
   * The path is relative to the working directory and uses forward slashes, so that
   * the same installation is recorded under one key on every platform.
   *
   * @param {{
   *   workingDirectoryPath: string
   *   targetDirectoryPath: string
   * }} params - Parameters.
   * @returns {string} Key of the installation.
   */
  static buildInstallationPath ({
    workingDirectoryPath,
    targetDirectoryPath,
  }) {
    return path.relative(
      workingDirectoryPath,
      targetDirectoryPath
    )
      .split(path.sep)
      .join('/')
  }

  /**
   * Constructor of this instance.
   *
   * @returns {typeof HoraCoreInstaller} Constructor of this instance.
   */
  get Ctor () {
    return /** @type {typeof HoraCoreInstaller} */ (this.constructor)
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
   * Install the distributed entries, replacing whatever the previous run installed.
   *
   * @returns {{
   *   installedEntryNames: Array<string>
   *   removedEntryNames: Array<string>
   * }} Entry names installed and removed by this run.
   * @public
   */
  install () {
    const removedEntryNames = this.removeInstalledEntries()
    const installedEntryNames = this.copyDistributedEntries()

    this.saveManifest({
      entryNames: installedEntryNames,
    })

    return {
      installedEntryNames,
      removedEntryNames,
    }
  }

  /**
   * Remove the entries the previous run installed.
   *
   * @returns {Array<string>} Removed entry names.
   */
  removeInstalledEntries () {
    const entryNames = this.collectRemovableEntryNames()

    entryNames.forEach(it => {
      this.fs.rmSync(
        this.buildTargetEntryPath({ entryName: it }),
        {
          recursive: true,
          force: true,
        }
      )
    })

    return entryNames
  }

  /**
   * Collect the entry names this run may remove.
   *
   * The manifest records what the previous run wrote, and an entry carrying the name of
   * something this package distributes is one it would have written, so both are
   * replaced. An entry named after nothing this package distributes is left alone, which
   * is what keeps a skill the consuming repository authored out of the removal.
   *
   * @returns {Array<string>} Entry names to remove.
   */
  collectRemovableEntryNames () {
    return [
      ...new Set([
        ...this.manifestFile.loadEntryNames(),
        ...this.collectDistributedEntryNamesInTarget(),
      ]),
    ]
      .toSorted()
  }

  /**
   * Collect the distributed entry names present in the target directory.
   *
   * @returns {Array<string>} Distributed entry names sitting in the target directory.
   */
  collectDistributedEntryNamesInTarget () {
    const installedEntryNames = this.collectEntryNames({
      directoryPath: this.targetDirectoryPath,
    })

    return this.collectDistributedEntryNames()
      .filter(it => installedEntryNames.includes(it))
  }

  /**
   * Collect the names of the entries directly under a directory.
   *
   * A payload is carried through whole, so a file counts as an entry exactly as a
   * directory does — an agent is one Markdown file, a skill one directory.
   *
   * @param {{
   *   directoryPath: string
   * }} params - Parameters.
   * @returns {Array<string>} Entry names, empty when the directory is absent.
   */
  collectEntryNames ({
    directoryPath,
  }) {
    if (!this.fs.existsSync(directoryPath)) {
      return []
    }

    return this.fs.readdirSync(directoryPath)
      .toSorted()
  }

  /**
   * Build the path an entry is installed at.
   *
   * @param {{
   *   entryName: string
   * }} params - Parameters.
   * @returns {string} Path of the installed entry.
   */
  buildTargetEntryPath ({
    entryName,
  }) {
    return this.path.join(
      this.targetDirectoryPath,
      entryName
    )
  }

  /**
   * Copy the distributed entries into the target directory.
   *
   * @returns {Array<string>} Copied entry names.
   */
  copyDistributedEntries () {
    const entryNames = this.collectDistributedEntryNames()

    this.fs.mkdirSync(
      this.targetDirectoryPath,
      { recursive: true }
    )

    entryNames.forEach(it => {
      this.fs.cpSync(
        this.buildSourceEntryPath({ entryName: it }),
        this.buildTargetEntryPath({ entryName: it }),
        { recursive: true }
      )
    })

    return entryNames
  }

  /**
   * Collect every entry name this package distributes in this payload.
   *
   * @returns {Array<string>} Distributed entry names.
   * @public
   */
  collectDistributedEntryNames () {
    return this.collectEntryNames({
      directoryPath: this.sourceDirectoryPath,
    })
  }

  /**
   * Build the path an entry is distributed at.
   *
   * @param {{
   *   entryName: string
   * }} params - Parameters.
   * @returns {string} Path of the distributed entry.
   */
  buildSourceEntryPath ({
    entryName,
  }) {
    return this.path.join(
      this.sourceDirectoryPath,
      entryName
    )
  }

  /**
   * Record what this run installed.
   *
   * @param {{
   *   entryNames: Array<string>
   * }} params - Parameters.
   * @returns {void}
   */
  saveManifest ({
    entryNames,
  }) {
    this.manifestFile.save({
      version: this.loadPackageVersion(),
      entryNames,
    })
  }

  /**
   * Load the version of this package.
   *
   * @returns {string | null} Version of this package, or null when unreadable.
   */
  loadPackageVersion () {
    try {
      const packageHash = JSON.parse(
        this.fs.readFileSync(
          new URL('../../package.json', import.meta.url),
          'utf8'
        )
      )

      return packageHash.version
        ?? null
    } catch {
      return null
    }
  }

  /**
   * Remove every entry this package installed, along with the manifest.
   *
   * @returns {{
   *   removedEntryNames: Array<string>
   * }} Removed entry names.
   * @public
   */
  uninstall () {
    const removedEntryNames = this.removeInstalledEntries()

    this.manifestFile.remove()

    return {
      removedEntryNames,
    }
  }
}
