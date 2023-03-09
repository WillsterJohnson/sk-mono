import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { getAllAppPaths } from "../lib/getAppPath.js";

export class SkMono {
  constructor(private readonly argv: string[]) {
    this.exec();
  }

  private async exec() {
    try {
      if (["-h", "--help", "help"].includes(this.argv[0])) this.help(this.argv[1]);
      else if (this.argv[0] === "init") this.init();
      else {
        if (!fs.existsSync(path.join(process.cwd(), "index.html"))) {
          const originalCwd = process.cwd();
          process.chdir(path.join(process.cwd(), "..", ".."));
          if (!fs.existsSync(path.join(process.cwd(), "index.html")))
            throw new Error(
              `Not an sk-mono project: could not find index.html at the current directory (${originalCwd}) or two levels above (${process.cwd()})`,
            );
        }
        if (this.argv[0] === "add") await this.add();
        else if (this.argv[0] === "listapps") this.listApps();
        else if (this.argv[0] === "package") await this.run(`app=${this.argv[1]} svelte-package`);
        else this.builtin();
      }
    } catch (e) {
      if (e instanceof Error) console.error("Command failed:", e.message);
      this.help(this.argv[0], true);
    }
  }

  private vite = ["dev", "build", "preview"];
  private sveltekit = ["sync", "check"];

  private help(command?: string, silentFail = false) {
    if (command)
      switch (command) {
        case "init":
          console.log(`Usage: sk-mono init`);
          console.log(`Initializes a new sk-mono project.`);
          break;
        case "add":
          console.log(`Usage: sk-mono add <type> <name>`);
          console.log(`Adds a new app or package with the given name.`);
          console.log(`Options:`);
          console.log(`  type (app, package)`);
          console.log(`  name (e.g. my-app)`);
          break;
        case "listapps":
          console.log(`Usage: sk-mono listapps`);
          console.log(`Lists all apps and packages in the current project.`);
        case "dev":
        case "build":
        case "preview":
          console.log(`Usage: sk-mono ${command} <app>`);
          console.log(`Runs \`vite ${command}\` for the given app.`);
          break;
        case "sync":
        case "check":
          console.log(`Usage: sk-mono ${command} <app>`);
          console.log(`Runs \`svelte-kit ${command}\` for the given app.`);
          break;
        case "package":
          console.log(`Usage: sk-mono package <app>`);
          console.log(`Runs \`svelte-package\` for the given app.`);
        default:
          if (!silentFail) console.log(`Unknown command: ${command}`);
          this.help();
          break;
      }
    else {
      console.log(`Usage: sk-mono <command> [options]`);
      console.log(`Commands:`);
      console.log(`  init`);
      console.log(`  add <type> <name>`);
      for (const command of [...this.vite, ...this.sveltekit]) console.log(`  ${command} <app>`);
      console.log(`  package <app>`);
      console.log(`Run \`sk-mono help <command>\` for more information on a command.`);
    }
  }

  private async run(command: string) {
    return new Promise((resolve, reject) => {
      const child = exec(`cd ${process.cwd()} && FORCE_COLOR=1 ${command}`);
      child.stdout?.on("data", process.stdout.write.bind(process.stdout));
      child.on("error", reject);
      child.on("exit", resolve);
    });
  }

  private async ensureSymlink(appDir: string) {
    return await Promise.all(
      ["lib", "assets", "params"].map((which) =>
        this.run(`cd ${appDir} && ln -s ../../../${which} ./global`),
      ),
    );
  }

  private exit(message: string) {
    console.error(message);
    process.exit(1);
  }

  private init() {
    const paths = {
      gitignore: path.join(process.cwd(), ".gitignore"),
      prettierignore: path.join(process.cwd(), ".prettierignore"),
      errorhtml: path.join(process.cwd(), "error.html"),
      globaldts: path.join(process.cwd(), "global.d.ts"),
      indexhtml: path.join(process.cwd(), "index.html"),
      packagejson: path.join(process.cwd(), "package.json"),
      pnpmworkspaceyaml: path.join(process.cwd(), "pnpm-workspace.yaml"),
      tsconfigjson: path.join(process.cwd(), "tsconfig.json"),
      prettierrc: path.join(process.cwd(), ".prettierrc"),
      svelteconfigjs: path.join(process.cwd(), "svelte.config.js"),
      viteconfigts: path.join(process.cwd(), "vite.config.ts"),
      assetsreadmemd: path.join(process.cwd(), "assets", "readme.md"),
      libreadmemd: path.join(process.cwd(), "lib", "readme.md"),
      paramsreadmemd: path.join(process.cwd(), "params", "readme.md"),
    };

    if (!this.argv.includes("--force")) {
      for (const [key, value] of Object.entries(paths) as [keyof typeof paths, string][]) {
        if (fs.existsSync(value)) {
          if (this.argv.includes("--repair")) delete paths[key];
          else
            this.exit(
              `File "${path.relative(
                process.cwd(),
                paths[key],
              )}" already exists (use \`--repair\` to skip files which exist, or \`--force\` to overwrite all files [YOUR CHANGES WILL NOT BE RECOVERABLE WHEN FORCING])`,
            );
        }
      }
    } else
      console.warn(
        "Forcing overwrite of all files (YOUR CHANGES WILL NOT BE RECOVERABLE WHEN FORCING)",
      );

    for (const folder of ["assets", "lib", "params", "apps", "packages"])
      fs.mkdirSync(path.join(process.cwd(), folder), { recursive: true });

    const writeIfInPaths = (file: string | undefined, content: string) =>
      file ? fs.writeFileSync(file, content) : null;

    writeIfInPaths(
      paths.gitignore,
      `.DS_Store\nnode_modules\n/build\n/.svelte-kit\n/package\n.env\n.env.*\n!.env.example\nvite.config.js.timestamp-*\nvite.config.ts.timestamp-*\n`,
    );
    writeIfInPaths(
      paths.prettierignore,
      `.DS_Store\nnode_modules\n/build\n/.svelte-kit\n/package\n.env\n.env.*\n!.env.example\n# Ignore files for PNPM, NPM and YARN\npnpm-lock.yaml\npackage-lock.json\nyarn.lock\n`,
    );
    writeIfInPaths(
      paths.errorhtml,
      `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <link rel="icon" href="%sveltekit.assets%/favicon.svg" />\n    <meta name="viewport" content="width=device-width" />\n    <title>%sveltekit.error.message%</title>\n  </head>\n  <body>\n    <main>\n      <p id="info-heading">Error information:</p>\n      <p id="status">Status: %sveltekit.status%</p>\n      <p id="message">Message: %sveltekit.error.message%</p>\n    </main>\n  </body>\n</html>\n`,
    );
    writeIfInPaths(
      paths.globaldts,
      `//declare global {\n//  namespace App {\n//    interface Error {}\n//    interface Locals {}\n//    interface PageData {}\n//    interface Platform {}\n//  }\n//}\nexport {};\n`,
    );
    writeIfInPaths(
      paths.indexhtml,
      `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <link rel="icon" href="%sveltekit.assets%/favicon.png" />\n    <meta name="viewport" content="width=device-width" />\n    %sveltekit.head%\n  </head>\n  <body data-sveltekit-preload-data="hover">\n    <div style="display: contents">%sveltekit.body%</div>\n  </body>\n</html>\n`,
    );
    writeIfInPaths(
      paths.packagejson,
      JSON.stringify(
        {
          name: "~sk-mono-project~",
          version: "0.1.0",
          private: true,
          type: "module",
          scripts: {
            dev: "skmono dev",
            build: "skmono build",
            preview: "skmono preview",
            sync: "skmono sync",
            check: "skmono check",
            package: "skmono package",
            lint: "prettier --plugin-search-dir . --check .",
            format: "prettier --plugin-search-dir . --write .",
          },
          devDependencies: {
            "@sveltejs/adapter-auto": "latest",
            "@sveltejs/kit": "latest",
            prettier: "latest",
            "prettier-plugin-svelte": "latest",
            "sk-mono": "latest",
            svelte: "latest",
            "svelte-check": "latest",
            tslib: "latest",
            typescript: "latest",
            vite: "latest",
          },
        },
        null,
        2,
      ),
    );
    writeIfInPaths(paths.pnpmworkspaceyaml, `packages:\n  - apps/*\n  - packages/*\n`);
    writeIfInPaths(
      paths.tsconfigjson,
      JSON.stringify(
        {
          compilerOptions: {
            paths: {
              "$lib/global": ["./global"],
              "$lib/global/*": ["./global/*"],
            },
            allowJs: true,
            checkJs: true,
            esModuleInterop: true,
            forceConsistentCasingInFileNames: true,
            resolveJsonModule: true,
            skipLibCheck: true,
            sourceMap: true,
            strict: true,
          },
          include: [
            "./ambient.d.ts",
            "./global.d.ts",
            "./vite.config.ts",
            "./hooks/**/*.ts",
            "./global/**/*.ts",
            "./params/**/*.ts",
          ],
          exclude: ["./node_modules/**", "./.svelte-kit/[!ambient.d.ts]**", "./service-worker.ts"],
        },
        null,
        2,
      ),
    );
    writeIfInPaths(
      paths.prettierrc,
      JSON.stringify(
        {
          useTabs: false,
          singleQuote: false,
          trailingComma: "all",
          printWidth: 100,
          plugins: ["prettier-plugin-svelte"],
          pluginSearchDirs: ["."],
          overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
        },
        null,
        2,
      ),
    );
    writeIfInPaths(
      paths.svelteconfigjs,
      `import adapter from "@sveltejs/adapter-auto";\nimport { vitePreprocess } from "@sveltejs/kit/vite";\nimport { skmonoKitConfig } from "sk-mono";\n\nexport default await skmonoKitConfig({\n  preprocess: vitePreprocess(),\n  kit_adapter: adapter(),\n});\n`,
    );
    writeIfInPaths(
      paths.viteconfigts,
      `import { sveltekit } from "@sveltejs/kit/vite";\nimport { skmonoViteConfig } from "sk-mono";\n\nexport default skmonoViteConfig({ plugins: [sveltekit()] });\n`,
    );
    writeIfInPaths(
      paths.assetsreadmemd,
      `# Global Assets\n\nAll the files in this folder are accessible in all of your apps and packages under their respective \`assets/global/\` folder.\n`,
    );
    writeIfInPaths(
      paths.libreadmemd,
      `# Global Lib\n\nAll the files in this folder are accessible in all of your apps and packages under their respective \`lib/global/\` folder. You can add a \`server\` folder just as you would normally to protect your server-side code.\n`,
    );
    writeIfInPaths(
      paths.paramsreadmemd,
      `# Global Params\n\nAll the files in this folder are accessible in all of your apps and packages under their respective \`params/global/\` folder.\n`,
    );

    if (this.argv.includes("--repair"))
      console.log("Repaired", Object.keys(paths).length, "files.");
    else console.log("Done! Your sk-mono project is ready.\nRun `pnpm i` to install dependencies.");
  }

  private async add() {
    const type = this.argv[1];
    if (!type) throw new Error("Missing type");
    if (type !== "app" && type !== "package") throw new Error(`Unknown type: ${type}`);
    const name = this.argv[2];
    if (!name) throw new Error("Missing name");
    const folderName = name.replace(/[^a-z0-9]/gi, "_");
    const addDir = path.join(process.cwd(), `${type}s`, folderName);
    if (fs.existsSync(addDir)) throw new Error(`Directory already exists: ${addDir}`);
    fs.mkdirSync(addDir, { recursive: true });

    const scripts =
      type === "app"
        ? {
            build: `skmono build ${type}s/${folderName}`,
            preview: `skmono preview ${type}s/${folderName}`,
          }
        : { package: `skmono package ${type}s/${folderName}` };
    const devDeps = type === "app" ? {} : { "@sveltejs/package": "latest" };
    const rootLevel =
      type === "app"
        ? {}
        : {
            svelte: "./dist/index.js",
            types: "./dist/index.d.ts",
            peerDependencies: {
              svelte: "latest",
            },
            exports: {
              ".": {
                types: "./dist/index.d.ts",
                svelte: "./dist/index.js",
              },
            },
            files: ["dist"],
          };
    fs.writeFileSync(
      path.join(addDir, "package.json"),
      JSON.stringify(
        {
          name,
          version: "0.1.0",
          private: true,
          type: "module",
          scripts: {
            ...scripts,
            dev: `skmono dev ${type}s/${folderName}`,
            sync: `skmono sync ${type}s/${folderName}`,
            check: `skmono check ${type}s/${folderName}`,
            lint: "prettier --plugin-search-dir . --check .",
            format: "prettier --plugin-search-dir . --write .",
          },
          devDependencies: {
            "@sveltejs/kit": "latest",
            ...devDeps,
            prettier: "latest",
            "prettier-plugin-svelte": "latest",
            "sk-mono": "latest",
            svelte: "latest",
            "svelte-check": "latest",
            tslib: "latest",
            typescript: "latest",
            vite: "latest",
          },
          ...rootLevel,
        },
        null,
        2,
      ),
    );
    fs.writeFileSync(path.join(addDir, ".env"), "# Environment Variables\n");
    fs.writeFileSync(
      path.join(addDir, "svelte.config.js"),
      "/** @type {import('sk-mono').FlatSvelteKitConfig} */\nexport default {};\n",
    );
    fs.writeFileSync(
      path.join(addDir, "tsconfig.json"),
      JSON.stringify(
        {
          extends: "./.svelte-kit/tsconfig.json",
          compilerOptions: {
            allowJs: true,
            checkJs: true,
            esModuleInterop: true,
            forceConsistentCasingInFileNames: true,
            resolveJsonModule: true,
            skipLibCheck: true,
            sourceMap: true,
            strict: true,
          },
          include: [
            "./.svelte-kit/ambient.d.ts",
            "../../global.d.ts",
            "./.svelte-kit/types/**/$types.d.ts",
            "../../vite.config.ts",
            "../../hooks/**/*.ts",
            "../../global/**/*.ts",
            ".../../params/**/*.ts",
            "./lib/**/*.ts",
            "./routes/**/*.ts",
            "./tests/**/*.ts",
          ],
          exclude: [
            "../../node_modules/**",
            "./.svelte-kit/[!ambient.d.ts]**",
            "./service-worker.ts",
          ],
        },
        null,
        2,
      ),
    );
    fs.writeFileSync(path.join(addDir, "worker.ts"), `// service worker\n`);

    fs.mkdirSync(path.join(addDir, "assets"));
    fs.mkdirSync(path.join(addDir, "lib"));
    fs.mkdirSync(path.join(addDir, "params"));
    fs.mkdirSync(path.join(addDir, "routes"));

    await this.ensureSymlink(addDir);

    console.log(
      `Done! Your new ${type} "${name}" is ready at \`${path.relative(process.cwd(), addDir)}\`.`,
    );
  }

  private listApps() {
    for (const app of getAllAppPaths()) console.log(app);
  }

  private async builtin() {
    let cmd = "";
    if (this.sveltekit.includes(this.argv[0])) cmd = "svelte-kit";
    else if (this.vite.includes(this.argv[0])) cmd = "vite";
    else throw new Error(`Unknown command: ${this.argv[0]}`);
    await this.run(`app=${this.argv[1]} ${cmd} ${this.argv[0]}`);
  }
}
