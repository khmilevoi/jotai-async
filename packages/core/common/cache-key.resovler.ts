import { atom } from "jotai";
import { atomEffect } from "jotai-effect";

import { generateId } from "../helpers/generate-id.ts";
import type { CacheKey, CacheKeyAtom } from "../types.ts";

export const cacheKeyResolver = (cacheKey?: CacheKeyAtom) => {
  const $resolvedCacheKey = atom<string | null>(null);

  const defaultCacheKey = stringifyCacheKey(["__default__", generateId()]);

  const cacheKeyEffect = atomEffect((get, set) => {
    if (cacheKey) {
      const keyArray = get(cacheKey);

      if (keyArray instanceof Promise) {
        const resolveCacheKey = async () => {
          const keyString = stringifyCacheKey(await keyArray);

          set($resolvedCacheKey, keyString);
        };
        resolveCacheKey();
      } else {
        const keyString = stringifyCacheKey(keyArray);

        set($resolvedCacheKey, keyString);
      }
    } else {
      set($resolvedCacheKey, defaultCacheKey);
    }

    return () => {
      set($resolvedCacheKey, null);
    };
  });

  return {
    $resolvedCacheKey,
    cacheKeyEffect,
  };
};

export const stringifyCacheKey = (cacheKey: CacheKey) => cacheKey.join(".");
