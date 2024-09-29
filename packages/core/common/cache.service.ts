import type { AsyncCallback } from "../types.ts";
import { AsyncService } from "./async.service.ts";

export class CacheService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private managerMap = new Map<string, AsyncService<any, any>>();
  private readonly keysStack: string[] = [];

  constructor(private readonly sizeOfStack: number = 100) {}

  getManager<Result, Payload>({
    key,
    callback,
  }: {
    key: string;
    callback: AsyncCallback<Result, Payload>;
  }): AsyncService<Result, Payload> {
    if (!this.managerMap.has(key)) {
      this.managerMap.set(key, new AsyncService<Result, Payload>(callback));
    }

    const index = this.keysStack.indexOf(key);

    if (index > -1) {
      this.keysStack.splice(index, 1);
    }

    this.keysStack.push(key);

    if (this.keysStack.length > this.sizeOfStack) {
      const lastKey = this.keysStack.shift();

      if (lastKey) {
        this.managerMap.delete(lastKey);
      }
    }

    return this.managerMap.get(key)!;
  }
}

export const cacheService = new CacheService();
