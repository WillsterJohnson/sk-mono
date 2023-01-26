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

#[no_mangle]
pub extern "C" fn temp() {}
