export function assertNever(n: never): never {
  throw new Error(`Unexpected item ${n}`);
}
