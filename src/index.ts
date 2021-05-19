export default function templural(chunks: TemplateStringsArray, ...args: number[]): string {
  return chunks
    .map((chunk, i) => {
      const plural = args[i - 1] > 1
      return chunk.replace(/\{(.*?)\}/g, (_match, g1) => {
        const split = g1.split(':')
        if (split.length === 1) return plural ? g1 : ''
        return plural ? split[1] : split[0]
      })
    })
    .reduce((s, chunk, i) => s + args[i - 1] + chunk)
}
