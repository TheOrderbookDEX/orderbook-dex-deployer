import { Form, InputGroup } from 'react-bootstrap';
import { useEffect, useState, useCallback } from 'react';
import TaskCheck from './TaskCheck';
import { asyncEffect, useAbortSignal } from './utils';
import { formatValue } from '@frugalwizard/abi2ts-lib';
import { getDevBalance, setDevBalance } from './ethereum';
import TaskButton from './TaskButton';
import TaskText from './TaskText';

export default function AccountBalance() {
  const abortSignal = useAbortSignal();
  const [ loading, setLoading ] = useState(true);
  const [ complete, setComplete ] = useState(false);
  const [ balance, setBalance ] = useState(0n);

  useEffect(() => {
    setComplete(balance > 0n);
  }, [ balance ]);

  const refresh = useCallback(async (abortSignal?: AbortSignal) => {
    setLoading(true);
    setBalance(await getDevBalance(abortSignal));
    setLoading(false);
  }, []);

  const getETH = useCallback(async (abortSignal?: AbortSignal) => {
    setLoading(true);
    await setDevBalance(1000000000000000000000n, abortSignal);
    setBalance(await getDevBalance(abortSignal));
    setLoading(false);
  }, []);

  useEffect(() => asyncEffect(async (abortSignal) => {
    await refresh(abortSignal);
  }), [ refresh ]);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Account Balance</Form.Label>
      <InputGroup>
        <TaskCheck loading={loading} complete={complete} />
        <TaskText grow>{formatValue(balance)}</TaskText>
        <TaskButton disabled={loading} onClick={() => refresh(abortSignal)}>Refresh</TaskButton>
        { complete ?
          <TaskText uppercase variant="success">Got ETH</TaskText>
        :
          <TaskButton disabled={loading} onClick={() => getETH(abortSignal)}>Get ETH</TaskButton>
        }
      </InputGroup>
    </Form.Group>
  );
}
