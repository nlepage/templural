export default function templural(chunks: TemplateStringsArray, ...args: number[]): string {
  return chunks
    .map((chunk, i) => {
      return chunk.replace(/\{(.*?)\}/g, (_match, g1) => {
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
    })
    .reduce((s, chunk, i) => s + args[i - 1] + chunk)
}
