import type { Getter, Setter } from "jotai";
import { atom } from "jotai";

import type { AsyncCallback } from "../types.ts";

export type AsyncAtomStatus =
  | "init"
  | "loading"
  | "fetching"
  | "success"
  | "error";

export class AsyncService<Result, Payload = void> {
  $isLoading = atom(false);
  $isFetching = atom(false);
  $isInitialized = atom(false);
  $error = atom<Error | null>(null);
  $status = atom<AsyncAtomStatus>("init");
  $data = atom<Result | null>(null);
  $signal = atom<AbortController | null>(null);
  $promise = atom<Promise<Result> | null>(null);

  constructor(private readonly callback: AsyncCallback<Result, Payload>) {}

  call({
    get,
    set,
    payload,
  }: {
    get: Getter;
    set: Setter;
    payload: Payload;
  }): Promise<Result> {
    const prevSignal = get(this.$signal);

    if (prevSignal) {
      prevSignal.abort();
    }

    set(this.$isFetching, true);
    set(this.$error, null);

    const isInitialized = get(this.$isInitialized);

    if (!isInitialized) {
      set(this.$isLoading, true);
      set(this.$status, "loading");
    } else {
      set(this.$status, "fetching");
    }

    const controller = new AbortController();
    set(this.$signal, controller);

    const promise = this.callback(
      { get, set, signal: controller.signal },
      payload,
    );

    set(this.$promise, promise);

    promise
      .then((response) => {
        set(this.$data, response);
        set(this.$status, "success");
        if (!isInitialized) {
          set(this.$isInitialized, true);
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          set(
            this.$error,
            error instanceof Error ? error : new Error(String(error)),
          );
          set(this.$status, "error");
        }
      })
      .finally(() => {
        set(this.$isFetching, false);
        if (!isInitialized) {
          set(this.$isLoading, false);
        }
      });

    return promise;
  }

  abort(get: Getter, set: Setter) {
    const controller = get(this.$signal);
    if (controller) {
      controller.abort();
      set(this.$status, "init");
      set(this.$isFetching, false);
      set(this.$isLoading, false);
    }
  }
}
