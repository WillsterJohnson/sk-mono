#!/usr/bin/env -S node --no-warnings
import fs from "node:fs";
import path from "node:path";
import child from "node:child_process";
import { checkForUpdate, fRoot } from "./checkUpdate.js";
import { install } from "./install.js";
run();
async function run() {
  const binPath = path.join(fRoot, "sk-mono");
  if (fs.existsSync(binPath)) await checkForUpdate();
  else await install();
  child.spawn(binPath, process.argv.slice(2), {
    stdio: "inherit",
    cwd: process.cwd(),
  });
}
