/*
 * Copyright (C) 2023-Present Will 'Willster' Johnson
 *
 * See license: <https://github.com/WillsterJohnson/sk-mono/blob/main/LICENSE.txt>
 */

use crate::cli::SKMono;
use clap::{ArgAction::SetTrue, Args};
use std::process::Command;

/// Runs the development server for the sveltekit app.
#[derive(Debug, Args)]
pub struct Dev {
    /// Arguments to pass to `vite dev`
    #[arg(last = true)]
    vite_dev_args: Vec<String>,
}

pub fn dev(cmd: &Dev, cli: &SKMono) {
    println!("{:?}", cmd.vite_dev_args)

    // cd to turbo dir and run `SKM_PROJECT_PATH={project path} vite dev [args]`
}
