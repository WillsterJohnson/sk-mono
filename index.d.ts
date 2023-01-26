/**
 * Includes all functions exposed to Node.js from sk-mono's Rust library
 */
export interface SkMono {
  /**
   * *TEST METHOD* - absolutely useless (unless your svelte app needs quick
   * access to random Fibonacci numbers), exists to prove that the FFI is
   * linking Rust and Node.js correctly
   *
   * Calculates the nth term in the Fibonacci sequence
   * ```
   *   n<0  -> f(n) = -Infinity
   * 0<n<3  -> f(n) = n
   *   n>=3 -> f(n) = f(n-1) + f(n-2)
   * ```
   *
   * @param n - the index of the Fibonacci sequence to calculate
   */
  fibonacci(n: number): number;
}
