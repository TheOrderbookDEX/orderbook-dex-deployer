import { createAbortifier } from './utils';
import { useCallback } from 'react';
import { Message } from './Messages';
import { CompilerVersion, LicenseType } from './etherscan';
import { OperatorV1 } from '@theorderbookdex/orderbook-dex-v1-operator/dist/OperatorV1';
import OperatorV1InputJson from '@theorderbookdex/orderbook-dex-v1-operator/artifacts/OperatorV1.input.json';
import Deployer from './Deployer';
import RegisterOperatorTask from './RegisterOperatorTask';

const code = JSON.stringify(OperatorV1InputJson);

interface Properties {
  operatorFactory: string;
  address: string;
  setAddress: (addressBook: string) => void;
  verifyURL?: string;
  verifyKey?: string;
  onMessage?: (message: Message) => void;
  onError?: (error: unknown) => void;
}

export default function OperatorV1Deployer({
  operatorFactory, address, setAddress, verifyURL, verifyKey, onMessage = console.log, onError = console.error
}: Properties) {

  const deployContract = useCallback(async (abortSignal?: AbortSignal) => {
    const abortify = createAbortifier(abortSignal);
    return (await abortify(OperatorV1.deploy())).address;
  }, []);

  const getDeployedCode = useCallback(async (abortSignal?: AbortSignal) => {
    const abortify = createAbortifier(abortSignal);
    return await abortify(OperatorV1.callStatic.deploy());
  }, []);

  const getCtorArgs = useCallback(() => undefined, []);

  return (
    <Deployer
      title="Operator V1"
      address={address}
      setAddress={setAddress}
      deployable={true}
      deployContract={deployContract}
      getDeployedCode={getDeployedCode}
      getCtorArgs={getCtorArgs}
      code={code}
      contract='OperatorV1.sol:OperatorV1'
      compiler={CompilerVersion.V0_8_20}
      license={LicenseType.MIT}
      verifyURL={verifyURL}
      verifyKey={verifyKey}
      onMessage={onMessage}
      onError={onError}
    >{props => <>
      <RegisterOperatorTask
        {...props}
        operatorFactory={operatorFactory}
      />
    </>}</Deployer>
  );
}
