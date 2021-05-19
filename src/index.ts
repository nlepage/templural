export default function templural(chunks: TemplateStringsArray, ...args: number[]): string {
  return chunks
    .map((chunk, i) => {
      const replacement = args[i - 1] > 1 ? '$1' : ''
      return chunk.replace(/\{(.*?)\}/g, replacement)
    })
    .reduce((s, chunk, i) => s + args[i - 1] + chunk)
}
