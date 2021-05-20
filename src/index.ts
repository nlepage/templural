export default function templural(chunks: TemplateStringsArray, ...args: number[]): string {
  let inCurlies = false

  return chunks.reduce((prev, chunk, i) => {
    let next = chunk

    if (inCurlies) {
      next = next.replace(/^:(.*?)}/, (_match, g1) => {
        const singular = args[i - 1] <= 1
        const split = g1.split(':')

        if (split.length === 1) return singular ?  '':g1

        if (split.length === 2) return singular ? split[0] : split[1]

        if (singular) return args[i - 1] === 0 ? split[0] : split[1]
        return split[2]
      })

      inCurlies = false
    } else {
      if (i > 0) next = args[i - 1] + next
    }

    next = next.replace(/\{(.*?)\}/g, (_match, g1) => {
      let plural = args[i - 1] > 1
      let split = g1.split(':')

      const indexMatch = /^\$(\d)+$/.exec(split[0])
      if (indexMatch != null) {
        plural = args[Number(indexMatch[1]) - 1] > 1
        split = split.slice(1)
      }

      if (split.length === 1) return plural ? g1 : ''

      return plural ? split[1] : split[0]
    })

    // using chunk.endsWith() and not next.endsWith() is intentional
    if (i < chunks.length - 1 && chunk.endsWith('{')) {
      next = next.slice(0, -1)
      inCurlies = true
    }
    
    return prev + next
  }, '')
}
