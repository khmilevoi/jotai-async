import { Atom, atom, Getter } from 'jotai';

import { AsyncCallback } from '../types';
import { AsyncService } from './async.service.ts';
import { cacheService } from './cache.service.ts';

export const asyncServiceFactory = <Result>(
  $resolvedCacheKey: Atom<string | null>,
  callback: AsyncCallback<Result, void>,
) => {
  const getManager = (get: Getter) => {
    const key = get($resolvedCacheKey);

    if (!key) {
      return null;
    }

    return cacheService.getManager({
      key,
      callback,
    });
  };

  const selectAtom = <Value>(
    selector: (manager: AsyncService<Result>) => Atom<Value>,
    initialValue: Value,
  ) =>
    atom((get) => {
      const manager = getManager(get);

      if (!manager) {
        return initialValue;
      }

      return get(selector(manager));
    });

  const selectMethod = <Return>(
    get: Getter,
    method: (manager: AsyncService<Result>) => Return,
  ) => {
    const manager = getManager(get);

    if (!manager) {
      return;
    }

    return method(manager);
  };

  return {
    selectAtom,
    selectMethod,
  };
};