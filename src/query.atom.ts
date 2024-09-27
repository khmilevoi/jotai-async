import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';

import { asyncServiceFactory } from './common/async-service.factory.ts';
import { cacheKeyResolver } from './common/cache-key.resovler.ts';
import type { AsyncCallback, CacheKeyAtom, QueryAtom } from './types';

export const queryAtom = <Result>(
  callback: AsyncCallback<Result, void>,
  options?: {
    cacheKey?: CacheKeyAtom;
    debugLabel?: string;
  },
): QueryAtom<Result> => {
  const { $resolvedCacheKey, cacheKeyEffect } = cacheKeyResolver(
    options?.cacheKey,
  );

  const { selectAtom, selectMethod } = asyncServiceFactory(
    $resolvedCacheKey,
    callback,
  );

  const queryEffect = atomEffect((get, set) => {
    selectMethod(get, (manager) =>
      manager.call({
        get,
        set,
        payload: undefined,
      }),
    );
  });
  queryEffect.debugLabel = `${options?.debugLabel}.queryEffect`;

  const $data = selectAtom((manager) => manager.$data, null);
  $data.debugLabel = `${options?.debugLabel}.$data`;

  const $base = atom((get) => {
    get(cacheKeyEffect);
    get(queryEffect);
    return get($data);
  });
  $base.debugLabel = `${options?.debugLabel}.$base`;

  const $status = selectAtom((manager) => manager.$status, 'init');
  $status.debugLabel = `${options?.debugLabel}.$status`;

  const $error = selectAtom((manager) => manager.$error, null);
  $error.debugLabel = `${options?.debugLabel}.$error`;

  const $isLoading = selectAtom((manager) => manager.$isLoading, true);
  $isLoading.debugLabel = `${options?.debugLabel}.$isLoading`;

  const $isFetching = selectAtom((manager) => manager.$isFetching, true);
  $isFetching.debugLabel = `${options?.debugLabel}.$isFetching`;

  const $promise = selectAtom((manager) => manager.$promise, null);
  $promise.debugLabel = `${options?.debugLabel}.$promise`;

  const mutation = atom(null, (get, set) => {
    return selectMethod(get, (manager) =>
      manager.call({
        get,
        set,
        payload: undefined,
      }),
    );
  });
  mutation.debugLabel = `${options?.debugLabel}.mutation`;

  const abort = atom(null, (get, set) => {
    selectMethod(get, (manager) => manager.abort(get, set));
  });
  abort.debugLabel = `${options?.debugLabel}.abort`;

  return Object.assign($base, {
    $data,
    $status,
    $error,
    $isLoading,
    $isFetching,
    $promise,
    mutation,
    abort,
  });
};