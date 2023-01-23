mod commands;

use clap::Parser;
use commands::Commands;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
pub struct SkMono {
    /// Show debug info
    #[arg(short, long, hide = true, action = clap::ArgAction::SetTrue)]
    debug: bool,

    #[command(subcommand)]
    command: Option<Commands>,
}

impl SkMono {
    fn debug(&self, msg: &str) {
        if self.debug {
            println!("\x1b[33m[\x1b[35mSKMONO\x1b[33m] \x1b[36mDEBUG\x1b[33m:\x1b[0m {msg}");
        }
    }
    fn help(&self, subcommand: &str) {
        if subcommand.len() > 0 {
            SkMono::parse_from(&["skmono", subcommand, "--help"]);
        } else {
            SkMono::parse_from(&["skmono", "--help"]);
        }
    }
}

fn main() {
    let cli = SkMono::parse();
    cli.debug("Debug mode enabled.");
    match &cli.command {
        Some(cmd) => cmd.run(&cli),
        None => {
            cli.debug("No command given, printing help.");
            println!("\x1b[34mSkMono is in early alpha, run with --debug if you encounter any issues\x1b[0m");
            cli.help("");
        }
    };
}
