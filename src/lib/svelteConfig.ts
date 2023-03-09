import { getAppPath } from "./getAppPath.js";
import fs from "node:fs";
import path from "node:path";
import { Config } from "@sveltejs/kit";

/**
 * Flat config makes merging in application-specific settings to the global settings easier
 */
export interface FlatSvelteKitConfig {
  extensions?: Config["extensions"];
  preprocess?: Config["preprocess"];

  package_source?: NonNullable<Config["package"]>["source"];
  package_dir?: NonNullable<Config["package"]>["dir"];
  package_emitTypes?: NonNullable<Config["package"]>["emitTypes"];
  package_exports?: NonNullable<Config["package"]>["exports"];
  package_files?: NonNullable<Config["package"]>["files"];

  kit_adapter?: NonNullable<Config["kit"]>["adapter"];
  kit_alias?: NonNullable<Config["kit"]>["alias"];
  kit_appDir?: NonNullable<Config["kit"]>["appDir"];
  kit_csp_mode?: NonNullable<NonNullable<Config["kit"]>["csp"]>["mode"];
  kit_csp_directives?: NonNullable<NonNullable<Config["kit"]>["csp"]>["directives"];
  kit_csp_reportOnly?: NonNullable<NonNullable<Config["kit"]>["csp"]>["reportOnly"];
  kit_csrf_checkOrigin?: NonNullable<NonNullable<Config["kit"]>["csrf"]>["checkOrigin"];
  kit_embedded?: NonNullable<Config["kit"]>["embedded"];
  kit_env_dir?: NonNullable<NonNullable<Config["kit"]>["env"]>["dir"];
  kit_env_publicPrefix?: NonNullable<NonNullable<Config["kit"]>["env"]>["publicPrefix"];
  // forced value
  // kit_files_assets?: NonNullable<NonNullable<Config["kit"]>["files"]>["assets"];
  // forced value
  // kit_files_hooks_client?: NonNullable<NonNullable<NonNullable<Config["kit"]>["files"]>["hooks"]>["client"];
  // forced value
  // kit_files_hooks_server?: NonNullable<NonNullable<NonNullable<Config["kit"]>["files"]>["hooks"]>["server"];
  // forced value
  // kit_files_lib?: NonNullable<NonNullable<Config["kit"]>["files"]>["lib"];
  // forced value
  // kit_files_params?: NonNullable<NonNullable<Config["kit"]>["files"]>["params"];
  // forced value
  // kit_files_routes?: NonNullable<NonNullable<Config["kit"]>["files"]>["routes"];
  // forced value
  // kit_files_serviceWorker?: NonNullable<NonNullable<Config["kit"]>["files"]>["serviceWorker"];
  // forced value
  // kit_files_appTemplate?: NonNullable<NonNullable<Config["kit"]>["files"]>["appTemplate"];
  // forced value
  // kit_files_errorTemplate?: NonNullable<NonNullable<Config["kit"]>["files"]>["errorTemplate"];
  kit_inlineStyleThreshold?: NonNullable<Config["kit"]>["inlineStyleThreshold"];
  kit_moduleExtensions?: NonNullable<Config["kit"]>["moduleExtensions"];
  // forced value
  // kit_outDir?: NonNullable<Config["kit"]>["outDir"];
  kit_output_preloadStrategy?: NonNullable<NonNullable<Config["kit"]>["output"]>["preloadStrategy"];
  kit_paths_assets?: NonNullable<NonNullable<Config["kit"]>["paths"]>["assets"];
  kit_paths_base?: NonNullable<NonNullable<Config["kit"]>["paths"]>["base"];
  kit_paths_relative?: NonNullable<NonNullable<Config["kit"]>["paths"]>["relative"];
  kit_prerender_concurrency?: NonNullable<NonNullable<Config["kit"]>["prerender"]>["concurrency"];
  kit_prerender_crawl?: NonNullable<NonNullable<Config["kit"]>["prerender"]>["crawl"];
  kit_prerender_handleHttpError?: NonNullable<
    NonNullable<Config["kit"]>["prerender"]
  >["handleHttpError"];
  kit_prerender_handleMissingId?: NonNullable<
    NonNullable<Config["kit"]>["prerender"]
  >["handleMissingId"];
  kit_prerender_origin?: NonNullable<NonNullable<Config["kit"]>["prerender"]>["origin"];
  kit_serviceWorker_register?: NonNullable<NonNullable<Config["kit"]>["serviceWorker"]>["register"];
  kit_serviceWorker_files?: NonNullable<NonNullable<Config["kit"]>["serviceWorker"]>["files"];
  kit_typescript_config?: NonNullable<NonNullable<Config["kit"]>["typescript"]>["config"];
  kit_version_name?: NonNullable<NonNullable<Config["kit"]>["version"]>["name"];
  kit_version_pollInterval?: NonNullable<NonNullable<Config["kit"]>["version"]>["pollInterval"];

  compilerOptions_format?: NonNullable<Config["compilerOptions"]["format"]>;
  compilerOptions_name?: NonNullable<Config["compilerOptions"]["name"]>;
  compilerOptions_filename?: NonNullable<Config["compilerOptions"]["filename"]>;
  compilerOptions_generate?: NonNullable<Config["compilerOptions"]["generate"]>;
  compilerOptions_errorMode?: NonNullable<Config["compilerOptions"]["errorMode"]>;
  compilerOptions_varsReport?: NonNullable<Config["compilerOptions"]["varsReport"]>;
  compilerOptions_sourcemap?: NonNullable<Config["compilerOptions"]["sourcemap"]>;
  compilerOptions_enableSourcemap?: NonNullable<Config["compilerOptions"]["enableSourcemap"]>;
  compilerOptions_outputFilename?: NonNullable<Config["compilerOptions"]["outputFilename"]>;
  compilerOptions_cssOutputFilename?: NonNullable<Config["compilerOptions"]["cssOutputFilename"]>;
  compilerOptions_sveltePath?: NonNullable<Config["compilerOptions"]["sveltePath"]>;
  compilerOptions_dev?: NonNullable<Config["compilerOptions"]["dev"]>;
  compilerOptions_accessors?: NonNullable<Config["compilerOptions"]["accessors"]>;
  compilerOptions_immutable?: NonNullable<Config["compilerOptions"]["immutable"]>;
  compilerOptions_hydratable?: NonNullable<Config["compilerOptions"]["hydratable"]>;
  compilerOptions_legacy?: NonNullable<Config["compilerOptions"]["legacy"]>;
  compilerOptions_customElement?: NonNullable<Config["compilerOptions"]["customElement"]>;
  compilerOptions_tag?: NonNullable<Config["compilerOptions"]["tag"]>;
  compilerOptions_css?: NonNullable<Config["compilerOptions"]["css"]>;
  compilerOptions_loopGuardTimeout?: NonNullable<Config["compilerOptions"]["loopGuardTimeout"]>;
  compilerOptions_namespace?: NonNullable<Config["compilerOptions"]["namespace"]>;
  compilerOptions_cssHash?: NonNullable<Config["compilerOptions"]["cssHash"]>;
  compilerOptions_preserveComments?: NonNullable<Config["compilerOptions"]["preserveComments"]>;
  compilerOptions_preserveWhitespace?: NonNullable<Config["compilerOptions"]["preserveWhitespace"]>;

  [key: string]: Config[string];
}

export async function skmonoKitConfig(config: FlatSvelteKitConfig) {
  const appDir = getAppPath();
  const appDirRelative = path.relative(process.cwd(), appDir);
  if (fs.existsSync(path.join(appDir, "svelte.config.js")))
    config = { ...config, ...(await import(path.join(appDir, "svelte.config.js"))).default };
  const kitConfig = normalizeConfig(config);
  kitConfig.kit = kitConfig.kit ?? {};
  kitConfig.kit.files = {
    appTemplate: "index.html",
    errorTemplate: "error.html",
    assets: `${appDirRelative}/assets`,
    hooks: {
      client: `${appDirRelative}/hooks/client.ts`,
      server: `${appDirRelative}/hooks/server.ts`,
    },
    lib: `${appDirRelative}/lib`,
    params: `${appDirRelative}/params`,
    routes: `${appDirRelative}/routes`,
    serviceWorker: `${appDirRelative}/worker.ts`,
  };
  kitConfig.kit.outDir = `${appDirRelative}/.svelte-kit`;
  return kitConfig;
}

function normalizeConfig(config: FlatSvelteKitConfig): Config {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(config)) {
    const pathSegments = key.split("_");
    let current = out;
    for (const segment of pathSegments.slice(0, -1)) {
      if (current[segment] === undefined) current[segment] = {};
      current = current[segment];
    }
    current[pathSegments[pathSegments.length - 1]] = value;
  }
  return out as Config;
}
