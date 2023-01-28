/*
 * Copyright (C) 2023-Present Will 'Willster' Johnson
 *
 * See license: <https://github.com/WillsterJohnson/sk-mono/blob/main/LICENSE.txt>
 */

pub mod test;

use self::test::Test;
use clap::Subcommand;

#[derive(Debug, Subcommand)]
pub enum Commands {
    Test(Test),
}
