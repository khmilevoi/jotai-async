import { createStore } from "jotai";
import { AsyncService } from "packages/core/common/async.service.ts";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSuccessCallback = vi.fn(async () => {
  return "Success!";
});

const mockErrorCallback = vi.fn(async () => {
  throw new Error("Test Error");
});

describe("AsyncService with real Jotai atoms", () => {
  let store: ReturnType<typeof createStore>;
  let service: AsyncService<string>;

  beforeEach(() => {
    store = createStore();
    service = new AsyncService(mockSuccessCallback);
  });

  it("should call callback and update status to success on successful execution", async () => {
    await service.call({
      get: store.get,
      set: store.set,
      payload: undefined,
    });

    expect(store.get(service.$isFetching)).toBe(false);
    expect(store.get(service.$status)).toBe("success");
    expect(store.get(service.$data)).toBe("Success!");
  });

  it("should handle error correctly and set status to error", async () => {
    service = new AsyncService<string>(mockErrorCallback);

    await expect(
      service.call({
        get: store.get,
        set: store.set,
        payload: undefined,
      }),
    ).rejects.toThrow("Test Error");

    expect(store.get(service.$isFetching)).toBe(false);
    expect(store.get(service.$status)).toBe("error");
    expect(store.get(service.$error)?.message).toBe("Test Error");
  });

  it("should abort the request and reset status", () => {
    const mockController = new AbortController();
    store.set(service.$signal, mockController);

    service.abort(store.get, store.set);

    expect(store.get(service.$status)).toBe("init");
    expect(store.get(service.$isFetching)).toBe(false);
    expect(store.get(service.$isLoading)).toBe(false);
    expect(mockController.signal.aborted).toBe(true);
  });

  it("should set isLoading only on the first call", async () => {
    const promise = service.call({
      get: store.get,
      set: store.set,
      payload: undefined,
    });

    expect(store.get(service.$isLoading)).toBe(true);
    expect(store.get(service.$status)).toBe("loading");

    await promise;

    const promise2 = service.call({
      get: store.get,
      set: store.set,
      payload: undefined,
    });

    expect(store.get(service.$isLoading)).toBe(false);
    expect(store.get(service.$status)).toBe("fetching");

    await promise2;
  });
});
