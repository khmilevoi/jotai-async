import type { Atom, Getter, Setter, WritableAtom } from "jotai";

export interface AsyncCallbackOptions {
  get: Getter;
  set: Setter;
  signal: AbortSignal;
}

export type AsyncCallback<Result, Payload> = (
  options: AsyncCallbackOptions,
  payload: Payload,
) => Promise<Result>;

export type CacheKeyAtom = Atom<CacheKey | Promise<CacheKey>>;

export type CacheKey = Array<string | number>;

export type QueryAtom<Result> = Atom<Result | null> & {
  mutation: WritableAtom<unknown, [], undefined | Promise<Result>>;
  $isFetching: Atom<boolean>;
  $data: Atom<Result | null>;
  abort: WritableAtom<unknown, [], void>;
  $error: Atom<Error | null>;
  $status: Atom<"init" | "loading" | "fetching" | "success" | "error">;
  $isLoading: Atom<boolean>;
  $promise: Atom<Promise<Result> | null>;
};
