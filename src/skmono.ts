#!/usr/bin/env node
import { SkMono } from "./skmono/index.js";

new SkMono(process.argv.slice(2).filter((arg) => arg !== "--"));
