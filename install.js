// @ts-nocheck
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
main();
async function main() {
  const binPath = path.join(__dirname, "sk-mono");
  if (!shouldUpdate(binPath)) process.exit(0);
  const platform = getPlatform();
  const version = require("./package.json").version;
  const binExt = platform.startsWith("win") ? ".exe" : "";
  const binName = `sk-mono-${version}-${platform}${binExt}`;
  const binUrl = `https://github.com/WillsterJohnson/sk-mono/releases/download/${version}/${binName}`;
  await writeExecutable(binUrl, binPath);
}
function shouldUpdate(target) {
  if (!fs.existsSync(target)) return true;
  return false;
}
async function writeExecutable(source, target) {
  const response = await fetch(source);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(target, buffer, { mode: 0o755 });
}
function getPlatform() {
  const type = os.type();
  const arch = os.arch();
  if (type === "Linux" && arch === "x64") return "linux-x86_64";
  else if (type === "Windows_NT")
    if (arch === "x64") return "win64-x86_64";
    else return "win32-i686";
  else if (type === "Darwin")
    throw new Error(
      "sk-mono does not currently support Darwin (MacOS). Sorry, we're working on it!",
    );
  else throw new Error(`Unsupported platform: ${type} ${arch}`);
}
