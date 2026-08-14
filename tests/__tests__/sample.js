describe('Sample', () => {
  test('addition', () => {
    expect(1 + 2)
      .toBe(3)
  })

  test('expect.deepContaining()', () => {
    const actual = {
      alpha: 1,
      beta: 2,
      gamma: {
        delta: 3,
        epsilon: 4,
      },
    }
    const expected = {
      alpha: 1,
      gamma: {
        delta: 3,
      },
    }

    expect(actual)
      .not
      .toEqual(expected)

    expect(actual)
      .toEqual(
        expect.deepContaining(expected)
      )
  })
})

describe('Jest extensions', () => {
  describe('expect.each()', () => {
    test('.toBe()', () => {
      const actual = [
        1 + 3,
        2 * 2,
      ]
      const expected = 4

      expect.each(actual)
        .toBe(expected)
    })

    test('.toBe.each()', () => {
      const actual = [
        1 + 3,
        2 * 4,
      ]
      const eachExpected = [
        4,
        8,
      ]

      expect.each(actual)
        .toBe.each(eachExpected)
    })
  })
})
