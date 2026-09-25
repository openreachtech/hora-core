/**
 * Kit files that have outgrown the byte budget recorded for them.
 */
export default class KitSizeBudget {
  /**
   * Constructor.
   *
   * @param {{
   *   tree: import('./KitMarkdownTree.js').default
   *   budgetHash: Record<string, number>
   * }} params - Parameters.
   */
  constructor ({
    tree,
    budgetHash,
  }) {
    this.tree = tree
    this.budgetHash = budgetHash
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof KitSizeBudget ? X : never} T, X
   * @param {{
   *   tree: import('./KitMarkdownTree.js').default
   *   budgetHash: Record<string, number>
   * }} params - Parameters for the factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    tree,
    budgetHash,
  }) {
    return new this({
      tree,
      budgetHash,
    })
  }

  /**
   * Collect every file over its budget or without one, and every budget without a file.
   *
   * @returns {Array<string>} Overruns, files first and stale budgets last.
   * @public
   */
  collectOverruns () {
    const relativePaths = this.tree.listRelativePaths()

    const staleBudgetOverruns = Object.keys(this.budgetHash)
      .filter(it => !relativePaths.includes(it))
      .toSorted()
      .map(it => `${it}: budgeted, but no such file`)

    return [
      ...relativePaths.flatMap(relativePath =>
        this.inspectFile({ relativePath })
      ),
      ...staleBudgetOverruns,
    ]
  }

  /**
   * Inspect one file against its budget.
   *
   * @param {{
   *   relativePath: string
   * }} params - Parameters.
   * @returns {Array<string>} Overruns.
   * @public
   */
  inspectFile ({
    relativePath,
  }) {
    const budget = this.budgetHash[relativePath]
      ?? null

    if (budget === null) {
      return [`${relativePath}: no budget recorded`]
    }

    const byteLength = this.tree.measureByteLength({ relativePath })

    return byteLength > budget
      ? [`${relativePath}: ${byteLength} bytes, over its budget of ${budget}`]
      : []
  }
}
