export function errorMessage(err: unknown, fallback = "Something went wrong.") {
  return err instanceof Error && err.message ? err.message : fallback
}
