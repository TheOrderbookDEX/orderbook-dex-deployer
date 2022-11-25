import React, { useEffect, useState } from 'react';

export function copy(str: string) {
  void (async () => {
    await navigator.clipboard.writeText(str);
  })();
}

export function is<T>(type: { new(...args: any[]): T }): (value: unknown) => value is T {
  return (value => value instanceof type) as (value: unknown) => value is T;
}

export function sleep(milliseconds: number, abortSignal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, milliseconds);
    abortSignal?.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(abortSignal.reason);
    });
  });
}

export function checkAbortSignal(abortSignal?: AbortSignal) {
  if (abortSignal?.aborted) throw abortSignal.reason;
}

export function createAbortifier(abortSignal?: AbortSignal): <T>(promise: Promise<T>) => Promise<T> {
  return async <T>(promise: Promise<T>) => {
    try {
      const result = await promise;
      checkAbortSignal(abortSignal);
      return result;

    } catch (error) {
      checkAbortSignal(abortSignal);
      throw error;
    }
  };
}

export function isAbortReason(abortSignal: AbortSignal | undefined, error: unknown) {
  return abortSignal?.aborted && abortSignal.reason === error;
}

export function catchAbortReason(abortSignal: AbortSignal | undefined, error: unknown) {
  if (!isAbortReason(abortSignal, error)) {
    throw error;
  }
}

export function asyncEffect(fn: (abortSignal: AbortSignal) => Promise<void>) {
  const abortController = new AbortController();
  void fn(abortController.signal).catch(error => catchAbortReason(abortController.signal, error));
  return () => abortController.abort();
}

export function useAbortSignal(deps: React.DependencyList = []) {
  const [ controller, setController ] = useState(() => new AbortController());
  useEffect(() => {
    setController(controller => {
      controller.abort();
      return new AbortController();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return controller.signal;
}
