import { UserConfig } from "vite";
import { getAppPath } from "./getAppPath.js";

export function skmonoViteConfig(config: UserConfig): UserConfig {
  if (config?.server?.fs?.allow?.length)
    console.log(
      "Warning: SkMono will handle vite's config.server.fs.allow (your changes will still be applied, but it is recommended not to set this option manually)",
    );
  config = config ?? {};
  config.server = config.server ?? {};
  config.server.fs = config.server.fs ?? {};
  config.server.fs.allow = config.server.fs.allow ?? [];
  config.server.fs.allow.push("lib", "assets", "params", getAppPath());
  return config;
}
