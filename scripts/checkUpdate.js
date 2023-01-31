// TODO: migrate to /src/lib.rs and call via FFI
import path from "node:path";
import url from "node:url";
import pkg from "../package.json" assert { type: "json" };
export const fRoot = path.join(
  url.fileURLToPath(path.dirname(import.meta.url)),
  "..",
);
export const { version: currentTag } = pkg;
export async function checkForUpdate() {
  const response = await fetch(
    "https://github.com/WillsterJohnson/sk-mono/releases/latest",
  );
  const latestTag = response.url.match(/\/tag\/(.*)$/)?.[1];

  if (!latestTag) return;
  if (latestTag === currentTag) return;

  const pad = (80 - (latestTag.length + 1)) / 2 - 1;
  console.log(
    "\x1b[33m┌──────────────────────────────────────────────────────────────────────────────┐\x1b[0m\n" +
      // line break
      "\x1b[33m│\x1b[0m                 " +
      "\x1b[35mThere is a new version of sk-mono available!\x1b[0m" +
      "                 \x1b[33m│\x1b[0m\n" +
      // line break
      "\x1b[33m│\x1b[0m" +
      " ".repeat(Math.floor(pad)) +
      `\x1b[36mv${latestTag}\x1b[33m` +
      " ".repeat(Math.ceil(pad)) +
      "\x1b[33m│\x1b[0m\n" +
      // line break
      "\x1b[33m│\x1b[0m                       " +
      "Run \x1b[32m`npm i -D sk-mono`\x1b[0m to update" +
      "                       \x1b[33m│\x1b[0m\n" +
      // line break
      "\x1b[33m└──────────────────────────────────────────────────────────────────────────────┘\x1b[0m",
  );
}
