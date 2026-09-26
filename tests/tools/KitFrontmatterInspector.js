/**
 * Frontmatter of kit skills and agents that Claude Code would misread or ignore.
 */
export default class KitFrontmatterInspector {
  /**
   * Constructor.
   *
   * @param {{
   *   tree: import('./KitMarkdownTree.js').default
   * }} params - Parameters.
   */
  constructor ({
    tree,
  }) {
    this.tree = tree
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof KitFrontmatterInspector ? X : never} T, X
   * @param {{
   *   tree: import('./KitMarkdownTree.js').default
   * }} params - Parameters for the factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    tree,
  }) {
    return new this({
      tree,
    })
  }

  /**
   * get: keysHash
   *
   * @returns {Record<KitFileKind, Array<string>>} Keys Claude Code documents, by file kind.
   */
  static get keysHash () {
    return {
      skill: [
        'name',
        'description',
        'when_to_use',
        'argument-hint',
        'arguments',
        'disable-model-invocation',
        'user-invocable',
        'allowed-tools',
        'disallowed-tools',
        'model',
        'effort',
        'context',
        'agent',
        'background',
        'hooks',
        'paths',
        'shell',
        'metadata',
        'license',
        'compatibility',
      ],
      agent: [
        'name',
        'description',
        'tools',
        'disallowedTools',
        'model',
        'permissionMode',
        'maxTurns',
        'skills',
        'mcpServers',
        'hooks',
        'memory',
        'background',
        'omitClaudeMd',
        'effort',
        'isolation',
        'color',
        'initialPrompt',
        'experimental',
      ],
    }
  }

  /**
   * get: requiredKeys
   *
   * @returns {Array<string>} Keys every skill and agent of the kit declares.
   */
  static get requiredKeys () {
    return [
      'name',
      'description',
    ]
  }

  /**
   * get: Ctor
   *
   * @returns {typeof KitFrontmatterInspector} Constructor of this instance.
   */
  get Ctor () {
    return /** @type {typeof KitFrontmatterInspector} */ (this.constructor)
  }

  /**
   * Collect every frontmatter violation across the kit's skills and agents.
   *
   * @returns {Array<{
   *   relativePath: string
   *   violation: string
   * }>} Violations, in file order.
   * @public
   */
  collectViolations () {
    return this.tree.listRelativePaths()
      .flatMap(relativePath =>
        this.inspectFile({ relativePath })
          .map(violation => ({
            relativePath,
            violation,
          }))
      )
  }

  /**
   * Inspect one kit file, passing over a file that needs no frontmatter.
   *
   * @param {{
   *   relativePath: string
   * }} params - Parameters.
   * @returns {Array<string>} Violations.
   * @public
   */
  inspectFile ({
    relativePath,
  }) {
    const kind = this.detectKind({ relativePath })

    if (kind === null) {
      return []
    }

    return this.inspectFrontmatter({
      kind,
      lines: this.extractFrontmatterLines({
        content: this.tree.readContent({ relativePath }),
      }),
    })
  }

  /**
   * Detect whether a kit file is a skill, an agent, or neither.
   *
   * @param {{
   *   relativePath: string
   * }} params - Parameters.
   * @returns {KitFileKind | null} File kind, or null when it needs no frontmatter.
   * @public
   */
  detectKind ({
    relativePath,
  }) {
    if (/^skills\/[^/]+\/SKILL\.md$/u.test(relativePath)) {
      return 'skill'
    }

    if (/^agents\/[^/]+\.md$/u.test(relativePath)) {
      return 'agent'
    }

    return null
  }

  /**
   * Extract the lines between the opening and closing `---`.
   *
   * @param {{
   *   content: string
   * }} params - Parameters.
   * @returns {Array<string> | null} Frontmatter lines, or null when there is none.
   * @public
   */
  extractFrontmatterLines ({
    content,
  }) {
    const [firstLine, ...restLines] = content.split('\n')
    const closingIndex = restLines.indexOf('---')

    if (firstLine !== '---' || closingIndex === -1) {
      return null
    }

    return restLines.slice(0, closingIndex)
  }

  /**
   * Inspect the frontmatter lines of one file.
   *
   * @param {{
   *   kind: KitFileKind
   *   lines: Array<string> | null
   * }} params - Parameters.
   * @returns {Array<string>} Violations.
   * @public
   */
  inspectFrontmatter ({
    kind,
    lines,
  }) {
    if (lines === null) {
      return ['no frontmatter between two --- lines']
    }

    const declaredKeys = lines.map(it => it.split(':')[0])

    const missingKeyViolations = this.Ctor.requiredKeys
      .filter(it => !declaredKeys.includes(it))
      .map(it => `missing key: ${it}`)

    return [
      ...lines.flatMap(line =>
        this.inspectLine({
          kind,
          line,
        })
      ),
      ...missingKeyViolations,
    ]
  }

  /**
   * Inspect one `key: value` line.
   *
   * @param {{
   *   kind: KitFileKind
   *   line: string
   * }} params - Parameters.
   * @returns {Array<string>} Violations.
   * @public
   */
  inspectLine ({
    kind,
    line,
  }) {
    const lineMatch = line.match(/^([A-Za-z_-]+):(?: (.*))?$/u)

    if (lineMatch === null) {
      return [`not a key: value line: ${line}`]
    }

    const [, key, value = ''] = lineMatch

    if (!this.Ctor.keysHash[kind].includes(key)) {
      return [`unknown key: ${key}`]
    }

    const unquotedValue = value.match(/^(['"])(.*)\1$/u)
      ?.[2]
      ?? value

    return [
      ...this.inspectPlainScalar({
        key,
        value,
      }),
      ...this.inspectValue({
        kind,
        key,
        value: unquotedValue,
      }),
    ]
  }

  /**
   * Inspect an unquoted value for text YAML reads as syntax.
   *
   * @param {{
   *   key: string
   *   value: string
   * }} params - Parameters.
   * @returns {Array<string>} Violations.
   * @public
   */
  inspectPlainScalar ({
    key,
    value,
  }) {
    if (/^(['"]).*\1$/u.test(value)) {
      return []
    }

    const checks = [
      {
        isViolated: /^(?:[[\]{}#&*!|>'"%@`]|[-?:](?:\s|$))/u.test(value),
        violation: `${key} starts with a YAML indicator: ${value[0]}`,
      },
      {
        isViolated: value.includes(': '),
        violation: `${key} holds ": ", which YAML reads as a nested mapping`,
      },
      {
        isViolated: value.includes(' #'),
        violation: `${key} holds " #", which YAML reads as a comment`,
      },
    ]

    return checks
      .filter(it => it.isViolated)
      .map(it => it.violation)
  }

  /**
   * Inspect `name`, `description` and `model`, holding a skill to the Agent Skills limits.
   *
   * @param {{
   *   kind: KitFileKind
   *   key: string
   *   value: string
   * }} params - Parameters.
   * @returns {Array<string>} Violations.
   * @public
   */
  inspectValue ({
    kind,
    key,
    value,
  }) {
    const isSkill = kind === 'skill'

    const checks = [
      {
        isViolated: key === 'name'
          && !/^[a-z0-9-]{1,64}$/u.test(value),
        violation: `name is not 1 to 64 lowercase letters, digits or hyphens: ${value}`,
      },
      {
        isViolated: key === 'description'
          && value.length === 0,
        violation: 'description is empty',
      },
      {
        isViolated: isSkill
          && key === 'description'
          && value.length > 1024,
        violation: `description runs ${value.length} characters, over 1024`,
      },
      {
        isViolated: isSkill
          && key === 'description'
          && /[<>]/u.test(value),
        violation: 'description holds an angle bracket',
      },
      {
        isViolated: key === 'model'
          && !/^(?:inherit|fable|opus|sonnet|haiku|claude-[a-z0-9.-]+)$/u.test(value),
        violation: `model is not an alias, a full model ID or inherit: ${value}`,
      },
    ]

    return checks
      .filter(it => it.isViolated)
      .map(it => it.violation)
  }
}

/**
 * @typedef {'skill' | 'agent'} KitFileKind
 */
