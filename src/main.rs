/*
 * Copyright (C) 2023-Present Will 'Willster' Johnson
 *
 * See license: <https://github.com/WillsterJohnson/sk-mono/blob/main/LICENSE.txt>
 */

mod cli;

fn main() {
    // TODO: remove in 1.0
    println!(
        "{} {} {}",
        "\x1b[33m(\x1b[31m!\x1b[33m)",
        "\x1b[36mSKMono is in early alpha,",
        "run `skmono --debug [COMMAND] <OPTIONS>` if you encounter any issues\x1b[0m"
    );
    cli::SKMono::run();
}
