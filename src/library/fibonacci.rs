/*
 * Copyright (C) 2023-Present Will 'Willster' Johnson
 *
 * See license: <https://github.com/WillsterJohnson/sk-mono/blob/main/LICENSE.txt>
 */

/// *TEST METHOD* - absolutely useless (unless your svelte app needs quick
/// access to random Fibonacci numbers), exists to prove that the FFI is
/// linking Rust and Node.js correctly
///
/// Calculates the nth term in the Fibonacci sequence
/// ```
///   n<0  -> f(n) = -Infinity
/// 0<n<3  -> f(n) = n
///   n>=3 -> f(n) = f(n-1) + f(n-2)
/// ```
///
/// * `n` - the index of the Fibonacci sequence to calculate
#[no_mangle]
pub extern "C" fn fibonacci(n: isize) -> isize {
    if n < 0 {
        return -isize::MAX;
    }
    if n <= 2 {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}
