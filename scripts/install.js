import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import tar from "tar";
import { checkForUpdate, currentTag, fRoot } from "./checkUpdate.js";
if (process.argv[1].includes("install.js")) install();
export async function install() {
  await checkForUpdate();

  fs.mkdirSync(path.join(fRoot, "tar"), { recursive: true });
  const fTar = path.join(fRoot, "tar", "bundle.tar.gz");

  const response = await getTar();

  await writeTarball(fTar, response.body);

  const tarDir = path.join(fRoot, "tar");

  const error = await tryThreeTimes(async () => {
    await tar.extract({ cwd: tarDir, file: fTar });

    const files = fs.readdirSync(tarDir);

    const fBin = files.find((file) => file.startsWith("sk-mono"));
    fs.cpSync(path.join(tarDir, fBin), path.join(fRoot, "sk-mono"));
    fs.chmodSync(path.join(fRoot, "sk-mono"), 0o755);

    const fLib = files.find((file) => file.startsWith("lib"));
    const osLibFile = path.join(fRoot, "lib." + fLib.split(".").slice(-1)[0]);
    fs.cpSync(path.join(tarDir, fLib), osLibFile);
    fs.chmodSync(osLibFile, 0o755);
  });

  fs.rmSync(tarDir, { recursive: true });
  if (error)
    throw new Error(
      "Failed to install SKMono (typically, retrying will install SKMono successfully)",
      // @ts-expect-error
      { cause: error },
    );
  console.log("SKMono installed successfully!");
}
async function writeTarball(target, source) {
  const fsWrite = fs.createWriteStream(target);
  const nodeWrite = new WritableStream({ write: (c) => void fsWrite.write(c) });
  await source.pipeTo(nodeWrite);
  fsWrite.end();
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
/**
 * @param {() => Promise<void> | void} cb
 * @param {number} maxFails
 * @returns {Promise<Error | void>}
 */
async function tryThreeTimes(cb, maxFails = 3) {
  try {
    await cb();
  } catch (e) {
    if (--maxFails === 0) {
      if (e instanceof Error) return e;
      else return new Error(e);
    } else {
      console.log(
        `Failed to install SKMono. Retrying... (${maxFails} attempts left, error: "${e.message}")`,
      );
    }
    return await tryThreeTimes(cb, maxFails);
  }
}
