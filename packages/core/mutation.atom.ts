import { atom } from "jotai";

import { AsyncService } from "./common/async.service.ts";
import type { AsyncCallback } from "./types.ts";

export const mutationAtom = <Result, Payload>(
  callback: AsyncCallback<Result, Payload>,
) => {
  const manager = new AsyncService<Result, Payload>(callback);

  const mutation = atom(null, (get, set, payload: Payload) => {
    return manager.call({ get, set, payload });
  });

  const abortAtom = atom(null, (get, set) => {
    manager.abort(get, set);
  });

  return Object.assign(mutation, {
    $data: manager.$data,
    $error: manager.$error,
    $status: manager.$status,
    $isLoading: manager.$isLoading,
    $isFetching: manager.$isFetching,
    $promise: manager.$promise,
    abort: abortAtom,
  });
};
