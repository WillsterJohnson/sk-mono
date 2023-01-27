import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import url from "node:url";
import tar from "tar";
import { checkForUpdate, currentTag } from "./checkUpdate.js";
main();
async function main() {
  await checkForUpdate();

  const fRoot = path.join(
    url.fileURLToPath(path.dirname(import.meta.url)),
    "..",
  );
  fs.mkdirSync(path.join(fRoot, "tar"), { recursive: true });
  const fTar = path.join(fRoot, "tar", "bundle.tar.gz");

  const response = await getTar();

  await writeTarball(fTar, response.body);

  await tar.extract({ cwd: path.join(fRoot, "tar"), file: fTar });

  const files = fs.readdirSync(path.join(fRoot, "tar"));

  normaliseFiles(files, "sk-mono", fRoot);
  normaliseFiles(files, "lib", fRoot);

  fs.rmSync(path.join(fRoot, "tar"), { recursive: true });
}
function normaliseFiles(files, name, root) {
  const fLib = files.find((file) => file.startsWith(name));
  console.log(fLib);
  fs.cpSync(path.join(root, "tar", fLib), path.join(root, name));
  fs.chmodSync(path.join(root, name), 0o755);
}
async function writeTarball(target, source) {
  const fsWrite = fs.createWriteStream(target);
  const nodeWrite = new WritableStream({
    write: (chunk) => void fsWrite.write(chunk),
    close: () => void fsWrite.end(),
  });
  await source.pipeTo(nodeWrite);
}
async function getTar() {
  const platform = getPlatform();
  const tarName = `sk-mono-${currentTag}-${platform}.tar.gz`;
  const tarUrl = `https://github.com/WillsterJohnson/sk-mono/releases/download/${currentTag}/${tarName}`;
  const response = await fetch(tarUrl);
  if (!response.ok)
    throw new Error(
      `sk-mono failed to update: could not download ${tarUrl} (${response.status} : ${response.statusText})`,
    );
  return response;
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
