/*
 * Copyright (C) 2023-Present Will 'Willster' Johnson
 *
 * See license: <https://github.com/WillsterJohnson/sk-mono/blob/main/LICENSE.txt>
 */

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
