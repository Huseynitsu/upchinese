declare module "hanzi-writer" {
  type Writer = {
    animateCharacter: () => void
    quiz: () => void
  }

  const HanziWriter: {
    create: (
      element: HTMLElement,
      character: string,
      options?: Record<string, unknown>
    ) => Writer
  }

  export default HanziWriter
}
