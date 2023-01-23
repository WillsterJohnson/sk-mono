pub mod test;

use clap::Subcommand;
use test::Test;

use crate::SkMono;

#[derive(Subcommand, Debug)]
pub enum Commands {
    /// SkMono isn't ready yet, but this command is supplied so you can explore
    /// the CLI
    Test(Test),
}

impl Commands {
    pub fn run(&self, cli: &SkMono) {
        cli.debug(format!("Running command: {:?}", self).as_str());
        // TODO: implicitly know that cmd.run exists
        match self {
            Commands::Test(cmd) => cmd.run(cli),
        }
    }
}
