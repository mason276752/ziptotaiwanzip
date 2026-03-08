declare module 'node-opencc' {
  const opencc: {
    simplifiedToTaiwanWithPhrases: (text: string) => string
    taiwanToSimplifiedWithPhrases: (text: string) => string
  }
  export default opencc
}
