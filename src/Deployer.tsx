import { Form, InputGroup } from 'react-bootstrap';
import { asyncEffect, copy, useAbortSignal } from './utils';
import { useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import { CompilerVersion, LicenseType, verifyContract } from './etherscan';
import { getCode, isAddress, isSameCode } from './ethereum';
import { Message } from './Messages';
import TaskCheck from './TaskCheck';
import TaskButton from './TaskButton';
import TaskInput from './TaskInput';
import TaskText from './TaskText';

interface Properties {
  title: string;
  address: string;
  setAddress: (addressBook: string) => void;
  deployable: boolean;
  deployContract(abortSignal?: AbortSignal): Promise<string>;
  getDeployedCode(abortSignal?: AbortSignal): Promise<string>;
  codeTolerance?: number;
  getCtorArgs(abortSignal?: AbortSignal): Promise<string> | string | undefined;
  code: string;
  contract: string;
  compiler: CompilerVersion;
  license: LicenseType;
  verifyURL?: string;
  verifyKey?: string;
  onMessage?: (message: Message) => void;
  onError?: (error: unknown) => void;
  children?: (props: {
    abortSignal: AbortSignal;
    address: string;
    loading: boolean;
    setLoading(loading: boolean): void;
    deployed: boolean;
    setComplete(complete: boolean): void;
    onMessage: (message: Message) => void;
    onError: (error: unknown) => void;
  }) => ReactNode;
}

export default function Deployer(props: Properties) {
  const abortSignal = useAbortSignal(Object.values(props));

  const {
    title, address, setAddress, deployable, deployContract, getDeployedCode,
    codeTolerance = 0, getCtorArgs, code, contract, compiler, license, verifyURL,
    verifyKey, onMessage = console.log, onError = console.error, children
  } = props;

  const copyAddress = useCallback(() => {
    copy(address);
    onMessage({
      time: Date.now(),
      title: 'Copy Address',
      body: <>Address copied to clipboard</>,
      variant: 'success',
      autohide: true,
    });
  }, [ address, onMessage ]);

  const [ loading, setLoading ] = useState(false);
  const [ deployed, setDeployed ] = useState(false);

  useEffect(() => asyncEffect(async (abortSignal) => {
    setDeployed(false);

    if (!isAddress(address)) {
      return;
    }

    setLoading(true);
    try {
      const code = await getCode(address, abortSignal);
      const expected = await getDeployedCode(abortSignal);
      setDeployed(isSameCode(code, expected, codeTolerance));

    } catch (error) {
      onError(error);

    } finally {
      setLoading(false);
    }
  }), [ address, getDeployedCode, codeTolerance, onError ]);

  const deploy = useCallback(async () => {
    setLoading(true);
    try {
      setAddress(await deployContract(abortSignal));

    } catch (error) {
      onError(error);

    } finally {
      setLoading(false);
    }
  }, [ setAddress, deployContract, abortSignal, onError ]);

  const [ verified, setVerified ] = useState(false);

  useEffect(() => setVerified(false), [ address ]);

  const verifiable = useMemo(() => deployed && deployable && Boolean(verifyKey), [ deployed, deployable, verifyKey ]);

  const verify = useCallback(async () => {
    setLoading(true);
    try {
      await verifyContract({
        apiURL: verifyURL as string,
        apiKey: verifyKey as string,
        address,
        code,
        contract,
        compiler,
        license,
        args: await getCtorArgs(abortSignal),
        abortSignal
      });
      setVerified(true);

    } catch (error) {
      if (/already verified/.test(String(error))) {
        setVerified(true);

      } else {
        onError(error);
      }

    } finally {
      setLoading(false);
    }
  }, [ verifyURL, verifyKey, address, code, contract, compiler, license, getCtorArgs, abortSignal, onError ]);

  const [ childrenLoading, setChildrenLoading ] = useState(false);
  const [ childrenComplete, setChildrenComplete ] = useState(false);

  const complete = useMemo(() => {
    if (!deployed) return false;
    if (verifyURL && !verified) return false;
    if (children && !childrenComplete) return false;
    return true;
  }, [children, childrenComplete, deployed, verified, verifyURL]);

  return (
    <Form.Group className="mb-3">
      <Form.Label>{title}</Form.Label>
      <InputGroup>
        <TaskCheck loading={loading || childrenLoading} complete={complete} />
        <TaskInput readOnly={loading || childrenLoading} value={address} onChange={setAddress} />
        <TaskButton disabled={!address} onClick={copyAddress}>Copy</TaskButton>
        { deployed ?
          <TaskText uppercase variant='success'>Deployed</TaskText>
        :
          <TaskButton disabled={loading || childrenLoading || !deployable} onClick={deploy}>Deploy</TaskButton>
        }
        {verifyURL &&
          <>
            {verified ?
              <TaskText uppercase variant='success'>Verified</TaskText>
            :
              <TaskButton disabled={loading || childrenLoading || !verifiable} onClick={verify}>Verify</TaskButton>
            }
          </>
        }
        {children?.({
          abortSignal,
          address,
          loading: loading || childrenLoading,
          setLoading: setChildrenLoading,
          deployed,
          onMessage,
          onError,
          setComplete: setChildrenComplete,
        })}
      </InputGroup>
    </Form.Group>
  );
}
