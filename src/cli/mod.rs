/*
 * Copyright (C) 2023-Present Will 'Willster' Johnson
 *
 * See license: <https://github.com/WillsterJohnson/sk-mono/blob/main/LICENSE.txt>
 */

mod commands;
mod debugger;

use clap::{ArgAction::SetTrue, Parser};
use commands::Commands;
use debugger::Debugger;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct CliArgs {
    /// Show debug info
    #[arg(short, long, hide = true, action = SetTrue)]
    debug: bool,
    /// The subcommand to run
    #[command(subcommand)]
    command: Option<Commands>,
}

pub struct SKMono {
    args: CliArgs,
    /// Debugger instance
    debugger: Option<Debugger>,
}

impl SKMono {
    /// Run SKMono
    pub fn run() {
        let mut cli = SKMono {
            args: CliArgs::parse(),
            debugger: None,
        };
        cli.debugger = Debugger::new(cli.args.debug);

        match &cli.args.command {
            Some(cmd) => {
                cli.debug(
                    format!("Running command: {:?}", &cli.args.command).as_str(),
                    0,
                );
                match cmd {
                    Commands::Test(ref test) => test.command(&cli),
                }
            }
            None => {
                cli.debug("No command given, printing help.", 1);
                cli.help("");
            }
        };
    }

    /// Print a message to the console if debug mode is enabled
    fn debug(&self, msg: &str, severity: usize) {
        match &self.debugger {
            Some(debugger) => debugger.log(msg, severity),
            None => (),
        }
    }

    /// Print help for a subcommand
    /// Prints help for the main command if no subcommand is given
    fn help(&self, subcommand: &str) {
        if subcommand.len() > 0 {
            CliArgs::parse_from(&["skmono", subcommand, "--help"]);
        } else {
            CliArgs::parse_from(&["skmono", "--help"]);
        }
    }
}
