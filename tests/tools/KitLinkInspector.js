/**
 * Relative links between kit files that fail to reach a file inside the kit.
 */
export default class KitLinkInspector {
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
   * @template {X extends typeof KitLinkInspector ? X : never} T, X
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
   * Collect every link whose target is missing or lies outside the kit.
   *
   * @returns {Array<{
   *   relativePath: string
   *   lineNumber: number
   *   target: string
   * }>} Unresolved links, in file order.
   * @public
   */
  collectUnresolvedLinks () {
    return this.tree.listRelativePaths()
      .flatMap(relativePath =>
        this.extractLinks({
          content: this.tree.readContent({ relativePath }),
        })
          .filter(({ target }) =>
            !this.isResolved({
              relativePath,
              target,
            })
          )
          .map(({ lineNumber, target }) => ({
            relativePath,
            lineNumber,
            target,
          }))
      )
  }

  /**
   * Extract the relative links written outside fenced code blocks.
   *
   * @param {{
   *   content: string
   * }} params - Parameters.
   * @returns {Array<{
   *   lineNumber: number
   *   target: string
   * }>} Links, in line order.
   * @public
   */
  extractLinks ({
    content,
  }) {
    const linkPatterns = [
      /\]\((\.{1,2}\/[^)\s]+)\)/gu,
      /`(\.{1,2}\/[^`\s]+?\.md(?:#[^`\s]*)?)`/gu,
    ]

    return this.extractProseLines({ content })
      .flatMap(({ line, lineNumber }) =>
        linkPatterns
          .flatMap(pattern => [...line.matchAll(pattern)])
          .toSorted((alpha, beta) => alpha.index - beta.index)
          .map(([, target]) => ({
            lineNumber,
            target,
          }))
      )
  }

  /**
   * Extract the lines outside fenced code blocks, numbered from 1.
   *
   * @param {{
   *   content: string
   * }} params - Parameters.
   * @returns {Array<{
   *   line: string
   *   lineNumber: number
   * }>} Prose lines.
   */
  extractProseLines ({
    content,
  }) {
    return content.split('\n')
      .reduce(
        (state, line, index) =>
          this.advanceFenceState({
            state,
            line,
            lineNumber: index + 1,
          }),
        {
          openFence: null,
          proseLines: [],
        }
      )
      .proseLines
  }

  /**
   * Advance the fence state by one line, keeping the line when it is prose.
   *
   * @param {{
   *   state: FenceState
   *   line: string
   *   lineNumber: number
   * }} params - Parameters.
   * @returns {FenceState} Next state.
   */
  advanceFenceState ({
    state: {
      openFence,
      proseLines,
    },
    line,
    lineNumber,
  }) {
    const fence = line.match(/^\s*(`{3,}|~{3,})/u)
      ?.[1]
      ?? null

    if (openFence !== null) {
      const closesFence = fence !== null
        && fence[0] === openFence[0]
        && fence.length >= openFence.length

      return {
        openFence: closesFence
          ? null
          : openFence,
        proseLines,
      }
    }

    if (fence !== null) {
      return {
        openFence: fence,
        proseLines,
      }
    }

    return {
      openFence,
      proseLines: [
        ...proseLines,
        {
          line,
          lineNumber,
        },
      ],
    }
  }

  /**
   * Tell whether a link target reaches an existing path inside the kit.
   *
   * @param {{
   *   relativePath: string
   *   target: string
   * }} params - Parameters.
   * @returns {boolean} true when resolved.
   * @public
   */
  isResolved ({
    relativePath,
    target,
  }) {
    const absolutePath = this.tree.resolveTarget({
      relativePath,
      target,
    })

    return this.tree.contains({ absolutePath })
      && this.tree.exists({ absolutePath })
  }
}

/**
 * @typedef {{
 *   openFence: string | null
 *   proseLines: Array<{
 *     line: string
 *     lineNumber: number
 *   }>
 * }} FenceState
 */
