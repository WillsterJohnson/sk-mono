import { Library } from "ffi-napi";

/** @type {import("./lib").SkMono} */
export const skMono = Library(
  "./target/x86_64-unknown-linux-gnu/debug/libsk_mono.so",
  {
    fibonacci: ["int", ["int"]],
  },
);
