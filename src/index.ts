const PluralRules = typeof Intl === 'object' ? Intl.PluralRules : undefined

const defaultRules: [number, number][][] = [
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

function factory(factoryLocales?: string | string[], factoryRules = defaultRules) {
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

    const splitRules = localeRules[split.length - 1]
    const n = args[index]

    let splitIndex = splitRules.findIndex(({ range: [start, end] }) => start <= n && n < end)

    if (splitIndex !== -1) return split[splitIndex]

    if (pluralRules === undefined) return ''

    const valueRule = pluralRules.select(n)

    splitIndex = splitRules.findIndex(({ rule }) => rule === valueRule)

    return splitIndex !== -1 ? split[splitIndex] : ''
  }

  let pluralRules: Intl.PluralRules

  templural.setLocales = function setLocales(locales?: string | string[]) {
    pluralRules = PluralRules && new PluralRules(locales)
    updateLocaleRules()
  }

  let localeRules: { range: [number, number], rule?: string }[][]

  templural.setRules = function setRules(rules: [number, number][][]) {
    localeRules = rules.map(splitRules => splitRules.map(range => ({ range })))
  }

  function updateLocaleRules() {
    if (pluralRules === undefined) return

    localeRules.forEach(splitRules => splitRules.forEach(
      rule => rule.rule = pluralRules.select(rule.range[0]),
    ))
  }

  templural.setRules(factoryRules)
  templural.setLocales(factoryLocales)

  return templural
}

export const templural = factory()

export function forLocales(locales?: string | string[]) {
  return factory(locales)
}

function resolveArgRef(s: string, args: any[]): string {
  const argRefMatch = /^\$(\d+)$/.exec(s)

  return argRefMatch ? toString(args[parseInt(argRefMatch[1]) - 1]) : s
}

function toString(v: any): string {
  return v == null ? '' : v.toString()
}