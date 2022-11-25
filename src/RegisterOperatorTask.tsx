import { asyncEffect, createAbortifier } from './utils';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { isAddress } from './ethereum';
import { OperatorFactory } from '@theorderbookdex/orderbook-dex-operator/dist/OperatorFactory';
import TaskButton from './TaskButton';
import TaskText from './TaskText';

interface Properties {
  abortSignal: AbortSignal;
  loading: boolean;
  setLoading(loading: boolean): void;
  deployed: boolean;
  operatorFactory: string;
  address: string;
  setComplete(complete: boolean): void;
  onError: (error: unknown) => void;
}

export default function RegisterOperatorTask({
  abortSignal, loading, setLoading, deployed, address, operatorFactory, setComplete, onError
}: Properties) {

  const [ registered, setRegistered ] = useState(false);

  useEffect(() => setComplete(registered), [ registered, setComplete ]);

  useEffect(() => asyncEffect(async (abortSignal) => {
    const abortify = createAbortifier(abortSignal);

    setRegistered(false);

    if (!isAddress(address)) {
      return;
    }

    if (!isAddress(operatorFactory)) {
      return;
    }

    setLoading(true);
    try {
      const implementation = await abortify(OperatorFactory.at(operatorFactory).versionImplementation(10000n));
      setRegistered(implementation === address);

    } catch (error) {
      onError(error);

    } finally {
      setLoading(false);
    }
  }), [ address, operatorFactory, onError, setLoading ]);

  const registerable = useMemo(() => deployed && isAddress(operatorFactory), [ deployed, operatorFactory ]);

  const register = useCallback(async () => {
    const abortify = createAbortifier(abortSignal);
    setLoading(true);
    try {
      await abortify(OperatorFactory.at(operatorFactory).registerVersion(10000n, address));
      setRegistered(true);
    } finally {
      setLoading(false);
    }
  },  [ abortSignal, address, operatorFactory, setLoading ]);

  return <>
    { registered ?
      <TaskText uppercase variant='success'>Registered</TaskText>
    :
      <TaskButton disabled={loading || !registerable} onClick={register}>Register</TaskButton>
    }
  </>;
}
