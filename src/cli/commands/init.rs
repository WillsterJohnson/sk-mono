/*
 * Copyright (C) 2023-Present Will 'Willster' Johnson
 *
 * See license: <https://github.com/WillsterJohnson/sk-mono/blob/main/LICENSE.txt>
 */

use crate::cli::SKMono;
use clap::Args;
use std::thread::sleep;
use std::time::Duration;

/// SKMono isn't ready yet, but this command is supplied so you can explore
/// the CLI
#[derive(Debug, Args)]
pub struct Init {
    /// Does something when set, run it and see!
    #[arg(short, long)]
    do_something: bool,
}

impl Init {
    pub fn command(&self, cli: &SKMono) {
        cli.debug("init", 0);
    }
}
