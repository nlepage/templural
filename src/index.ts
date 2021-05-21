export function templural(chunks: TemplateStringsArray, ...args: any[]): string {
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

  const splitIndex = rules[split.length - 1].findIndex(({ range: [start, end] }) => args[index] >= start && args[index] < end)

  if (splitIndex !== -1) return split[splitIndex]

  // FIXME
  return ''
}

function resolveArgRef(s: string, args: any[]): string {
  const argRefMatch = /^\$(\d+)$/.exec(s)
  return argRefMatch ? toString(args[parseInt(argRefMatch[1]) - 1]) : s
}

function toString(v: any): string {
  return v == null ? '' : v.toString()
}

const rules = [
  [
    { range: [2, Number.POSITIVE_INFINITY] },
  ],
  [
    { range: [1, 2] },
    { range: [2, Number.POSITIVE_INFINITY] },
  ],
  [
    { range: [0, 1] },
    { range: [1, 2] },
    { range: [2, Number.POSITIVE_INFINITY] },
  ],
]