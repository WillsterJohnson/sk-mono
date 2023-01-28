/*
 * Copyright (C) 2023-Present Will 'Willster' Johnson
 *
 * See license: <https://github.com/WillsterJohnson/sk-mono/blob/main/LICENSE.txt>
 */

pub struct Debugger {
    severity_glyphs: Vec<&'static str>,
}

impl Debugger {
    /// Create a new Debug instance
    pub fn new(debug: bool) -> Option<Debugger> {
        if !debug {
            return None;
        }
        let debugger = Debugger {
            severity_glyphs: vec!["\x1b[32m(*)", "\x1b[33m(?)", "\x1b[31m(!)"],
        };
        debugger.log("Running in debug mode because --debug was set to true", 0);
        debugger.log("severity=0; info", 0);
        debugger.log("severity=1; warning", 1);
        debugger.log("severity=2; error", 2);
        debugger.log("### LOGS ###", 0);
        return Some(debugger);
    }
    /// Print a message to the console if debug mode is enabled
    pub fn log(&self, msg: &str, mut severity: usize) {
        if severity > 2 {
            severity = 2;
        }
        println!(
            "\x1b[33m[\x1b[35mSKMONO\x1b[33m] \x1b[36mDEBUG{}:\x1b[0m {msg}",
            self.severity_glyphs[severity],
        );
    }
}
