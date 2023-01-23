use clap::Args;
use std::{thread, time};

use crate::SkMono;

#[derive(Debug, Args)]
pub struct Test {
    /// Does something when set, run it and see!
    #[arg(short, long)]
    do_something: bool,
}

impl Test {
    pub fn run(&self, cli: &SkMono) {
        cli.debug("test");
        if self.do_something {
            println!("Doing something...");
            thread::sleep(time::Duration::from_secs(3));
            println!("Done!");
            thread::sleep(time::Duration::from_secs(1));
            println!("Successfully created an mp4 of this command being run.");
            println!("View: \x1b[36mhttps://www.youtube.com/watch?v=o-YBDTqX_ZU\x1b[0m");
        } else {
            cli.help("test");
        }
    }
}
