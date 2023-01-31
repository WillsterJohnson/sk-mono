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
pub struct Test {
    /// Does something when set, run it and see!
    #[arg(short, long)]
    do_something: bool,
}

impl Test {
    pub fn command(&self, cli: &SKMono) {
        cli.debug("test", 0);
        if self.do_something {
            println!("Doing something...");
            sleep(Duration::from_secs(3));
            println!("Done!");
            sleep(Duration::from_secs(1));
            println!("Successfully created an mp4 of this command being run.");
            println!("View: \x1b[36mhttps://www.youtube.com/watch?v=o-YBDTqX_ZU\x1b[0m");
        } else {
            cli.help("test");
        }
    }
}
