/// <reference lib="webworker" />

/**
 * Adds the necessary event listeners to the service worker to cache files and assets.
 * @param worker - the service worker
 * @param cacheHash - a unique has for this deployment. Recommended to use the `version` imported from `$service-worker`
 * @param files - the files to cache. Recommened to merge the `files` and `build` imports from `$service-worker`
 *
 * @example
 * ```ts
 * import { build, files, version } from "$service-worker";
 * import { workerCache } from "sk-mono";
 *
 * workerCache(sw, version, [...build, ...files]);
 * ```
 */
export function workerCache(worker: ServiceWorkerGlobalScope, cacheHash: string, files: string[]) {
  const cacheId = `skmono-cacher-${cacheHash}`;

  worker.addEventListener("install", (event) =>
    event.waitUntil(new Promise(async () => await (await caches.open(cacheId)).addAll(files))),
  );

  worker.addEventListener("activate", (event) =>
    event.waitUntil(
      new Promise(async () =>
        (await caches.keys()).forEach(async (key) => key !== cacheId && (await caches.delete(key))),
      ),
    ),
  );

  worker.addEventListener(
    "fetch",
    (event) =>
      event.request.method === "GET" &&
      event.respondWith(
        new Promise(async (resolve) => {
          const url = new URL(event.request.url);
          const cache = await caches.open(cacheId);
          try {
            if (files.includes(url.pathname)) throw null; // jump to catch
            const response = await fetch(event.request);
            if (response.status === 200) cache.put(event.request, response.clone());
            resolve(response);
          } catch {
            resolve(cache.match(event.request) as Promise<Response>);
          }
        }),
      ),
  );
}
