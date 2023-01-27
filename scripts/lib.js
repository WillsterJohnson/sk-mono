import { Library } from "ffi-napi";
import path from "node:path";
import url from "node:url";

/** @type {import("./lib").SkMono} */
export const skMono = Library(
  path.join(url.fileURLToPath(path.dirname(import.meta.url)), "..", "lib"),
  {
    fibonacci: ["int", ["int"]],
  },
);
