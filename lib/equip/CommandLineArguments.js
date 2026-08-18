/**
 * The arguments given to the `hora-core` command.
 *
 * Both `--name value` and `--name=value` are accepted, and anything that is neither an
 * option name nor the value following one is read as a command name.
 */
export default class CommandLineArguments {
  /**
   * Constructor.
   *
   * @param {{
   *   args: Array<string>
   * }} params - Parameters.
   */
  constructor ({
    args,
  }) {
    this.args = args
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof CommandLineArguments ? X : never} T, X
   * @param {{
   *   args: Array<string>
   * }} params - Parameters for the factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    args,
  }) {
    return new this({
      args,
    })
  }

  /**
   * The hash a fold over the arguments starts from.
   *
   * @returns {ParsedArgumentsHash} Empty parse result.
   */
  static get initialParsedHash () {
    return {
      commandNames: [],
      optionHash: {},
      pendingName: null,
    }
  }

  /**
   * Fold one argument token into the parse result.
   *
   * @param {{
   *   parsedHash: ParsedArgumentsHash
   *   token: string
   * }} params - Parameters.
   * @returns {ParsedArgumentsHash} Parse result including the token.
   */
  static foldToken ({
    parsedHash,
    token,
  }) {
    if (parsedHash.pendingName) {
      return {
        ...parsedHash,
        optionHash: {
          ...parsedHash.optionHash,
          [parsedHash.pendingName]: token,
        },
        pendingName: null,
      }
    }

    const inlineMatched = token.match(/^--(?<name>[a-z][\w-]*)=(?<value>.*)$/u)

    if (inlineMatched) {
      return {
        ...parsedHash,
        optionHash: {
          ...parsedHash.optionHash,
          [inlineMatched.groups.name]: inlineMatched.groups.value,
        },
      }
    }

    const nameMatched = token.match(/^--(?<name>[a-z][\w-]*)$/u)

    if (nameMatched) {
      return {
        ...parsedHash,
        pendingName: nameMatched.groups.name,
      }
    }

    return {
      ...parsedHash,
      commandNames: [
        ...parsedHash.commandNames,
        token,
      ],
    }
  }

  /**
   * Constructor of this instance.
   *
   * @returns {typeof CommandLineArguments} Constructor of this instance.
   */
  get Ctor () {
    return /** @type {typeof CommandLineArguments} */ (this.constructor)
  }

  /**
   * Extract the command name.
   *
   * @returns {string | null} Command name, or null when none was given.
   * @public
   */
  extractCommand () {
    const { commandNames } = this.buildParsedHash()
    const [command = null] = commandNames

    return command
  }

  /**
   * Build the parse result of every argument.
   *
   * @returns {ParsedArgumentsHash} Parse result.
   */
  buildParsedHash () {
    return this.args
      .reduce(
        (parsedHash, token) => this.Ctor.foldToken({ parsedHash, token }),
        this.Ctor.initialParsedHash
      )
  }

  /**
   * Extract the value of an option.
   *
   * @param {{
   *   name: string
   * }} params - Parameters.
   * @returns {string | null} Option value, or null when the option was not given.
   */
  extractOptionValue ({
    name,
  }) {
    const { optionHash } = this.buildParsedHash()

    return optionHash[name]
      ?? null
  }

  /**
   * Extract the target directory given by `--dir`.
   *
   * @returns {string | null} Target directory, or null when the option was not given.
   * @public
   */
  extractTargetDirectoryPath () {
    return this.extractOptionValue({
      name: 'dir',
    })
  }
}

/**
 * @typedef {{
 *   commandNames: Array<string>
 *   optionHash: Record<string, string>
 *   pendingName: string | null
 * }} ParsedArgumentsHash
 */
