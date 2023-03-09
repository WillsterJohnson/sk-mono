import fs from "node:fs";
import path from "node:path";

export function getAppPath(app = process.env.app) {
  if (!app) throw new Error("No app specified.");

  if (getAllAppPaths().includes(app)) return path.join(process.cwd(), app);

  throw new Error(
    `(${process.cwd()}) Could not find app "${app}", does it have a \`package.json\`? (provide the folder name apps/name or packages/name)`,
  );
}

export function getAllAppPaths() {
  const apps = fs
    .readdirSync(path.join(process.cwd(), "apps"))
    .map((app) => path.join("apps", app));
  const packages = fs
    .readdirSync(path.join(process.cwd(), "packages"))
    .map((app) => path.join("packages", app));
  return [...apps, ...packages].filter((app) => verify(path.join(process.cwd(), app)));
}

function verify(dir: string) {
  return fs.existsSync(path.join(dir, "package.json"));
}
