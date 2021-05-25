const PluralRules = typeof Intl === 'object' ? Intl.PluralRules : undefined

type Locales = string | string[]

type Range = [number, number]
type Ranges = Range[][]

const defaultRanges: Ranges = [
  [
    [2, Number.POSITIVE_INFINITY],
  ],
  [
    [1, 2],
    [2, Number.POSITIVE_INFINITY],
  ],
  [
    [0, 1],
    [1, 2],
    [2, Number.POSITIVE_INFINITY],
  ],
]

export function forConfig(config: { locales?: Locales, ranges?: Ranges } = { ranges: defaultRanges }) {
  function templural(chunks: TemplateStringsArray, ...args: any[]): string {
    let inCurlies = false

    return chunks.reduce((prev, chunk, i) => {
      let next = chunk

      if (inCurlies) {
        next = next.replace(/^:(.*?)}/, (_match, g1) => resolve(g1.split(':'), args, i - 1))

        inCurlies = false
      } else {
        if (i > 0) next = toString(args[i - 1]) + next
      }

      next = next.replace(/\{(.*?)\}/g, (_match, g1) => {
        let index = i - 1
        let split = g1.split(':')

        const indexMatch = /^\$(\d)+$/.exec(split[0])
        if (indexMatch != null) {
          index = Number(indexMatch[1]) - 1
          split = split.slice(1)
        }

        return resolve(split, args, index)
      })

      // using chunk.endsWith() and not next.endsWith() is intentional
      if (i < chunks.length - 1 && chunk.endsWith('{')) {
        next = next.slice(0, -1)
        inCurlies = true
      }

      return prev + next
    }, '')
  }

  function resolve(split: string[], args: any[], index: number): string {
    return resolveArgRef(resolveSplit(split, args, index), args)
  }

  function resolveSplit(split: string[], args: any[], index: number): string {
    if (index === -1 || typeof args[index] !== 'number') return ''

    const splitRanges = rangesWPluralRule[split.length - 1]
    const n = args[index]

    let splitIndex = splitRanges.findIndex(({ range: [start, end] }) => start <= n && n < end)

    if (splitIndex !== -1) return split[splitIndex]

    if (pluralRules === undefined) return ''

    const valueRule = pluralRules.select(n)

    splitIndex = splitRanges.findIndex(({ rule }) => rule === valueRule)

    return splitIndex !== -1 ? split[splitIndex] : ''
  }

  let pluralRules: Intl.PluralRules

  templural.setLocales = function setLocales(locales?: string | string[]) {
    pluralRules = PluralRules && new PluralRules(locales)

    updatePluralRules()

    return templural
  }

  let rangesWPluralRule: { range: Range, rule?: string }[][]

  templural.setRanges = function setRanges(ranges: Ranges = defaultRanges) {
    rangesWPluralRule = ranges.map(splitRanges => splitRanges.map(range => ({ range })))

    updatePluralRules()

    return templural
  }

  function updatePluralRules() {
    if (pluralRules === undefined) return

    rangesWPluralRule.forEach(splitRanges => splitRanges.forEach(
      range => { range.rule = pluralRules.select(range.range[0]) },
    ))
  }

  templural.setRanges(config.ranges)
  templural.setLocales(config.locales)

  return templural
}

export const templural = forConfig()

export function forLocales(locales?: string | string[]) {
  return forConfig({ locales })
}

export function forRanges(ranges: Ranges) {
  return forConfig({ ranges })
}

function resolveArgRef(s: string, args: any[]): string {
  const argRefMatch = /^\$(\d+)$/.exec(s)

  return argRefMatch ? toString(args[parseInt(argRefMatch[1]) - 1]) : s
}

function toString(v: any): string {
  return v == null ? '' : v.toString()
}