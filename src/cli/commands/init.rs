/*
 * Copyright (C) 2023-Present Will 'Willster' Johnson
 *
 * See license: <https://github.com/WillsterJohnson/sk-mono/blob/main/LICENSE.txt>
 */

use crate::cli::SKMono;
use clap::Args;

/// Initialize a SvelteKit Monorepo
#[derive(Debug, Args)]
pub struct Init {
    /// none
    #[arg(short, long)]
    none: bool,
}

impl Init {
    pub fn command(&self, cli: &SKMono) {
        cli.debug("init", 0);
    }
}
