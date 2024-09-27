import { useAtomValue } from "jotai";
import type { QueryAtom } from "../types.ts";

export const useQueryAtom = <Result>(query: QueryAtom<Result>) => {
  let data = useAtomValue(query);
  const isLoading = useAtomValue(query.$isLoading);
  const isFetching = useAtomValue(query.$isFetching);
  const status = useAtomValue(query.$status);
  const error = useAtomValue(query.$error);

  try {
    data = useAtomValue(query.$promise);
  } catch (error) {
    if (error instanceof Promise && data === null) {
      throw error;
    }
  }

  return {
    data,
    isLoading,
    isFetching,
    status,
    error
  };
};