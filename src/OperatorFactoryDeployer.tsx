import { createAbortifier } from './utils';
import { useCallback, useMemo } from 'react';
import { Message } from './Messages';
import { CompilerVersion, LicenseType } from './etherscan';
import { getAccount, isAddress } from './ethereum';
import { abiencode } from '@frugalwizard/abi2ts-lib';
import { OperatorFactory } from '@theorderbookdex/orderbook-dex-operator/dist/OperatorFactory';
import OperatorFactoryInputJson from '@theorderbookdex/orderbook-dex-operator/artifacts/OperatorFactory.input.json';
import Deployer from './Deployer';

const code = JSON.stringify(OperatorFactoryInputJson);

interface Properties {
  addressBook: string;
  address: string;
  setAddress: (addressBook: string) => void;
  verifyURL?: string;
  verifyKey?: string;
  onMessage?: (message: Message) => void;
  onError?: (error: unknown) => void;
}

export default function OperatorFactoryDeployer({
  addressBook, address, setAddress, verifyURL, verifyKey, onMessage = console.log, onError = console.error
}: Properties) {

  const deployable = useMemo(() => isAddress(addressBook), [ addressBook ]);

  const deployContract = useCallback(async (abortSignal?: AbortSignal) => {
    const abortify = createAbortifier(abortSignal);
    const account = await getAccount(abortSignal);
    return (await abortify(OperatorFactory.deploy(account, addressBook))).address;
  }, [ addressBook]);

  const getDeployedCode = useCallback(async (abortSignal?: AbortSignal) => {
    const abortify = createAbortifier(abortSignal);
    const account = await getAccount(abortSignal);
    return await abortify(OperatorFactory.callStatic.deploy(account, addressBook));
  }, [ addressBook ]);

  const getCtorArgs = useCallback(async (abortSignal?: AbortSignal) => {
    const account = await getAccount(abortSignal);
    return abiencode(
      [ 'address', 'address' ],
      [ account, addressBook ]
    ).slice(2);
  }, [ addressBook ]);

  return (
    <Deployer
      title="Operator Factory"
      address={address}
      setAddress={setAddress}
      deployable={deployable}
      deployContract={deployContract}
      getDeployedCode={getDeployedCode}
      getCtorArgs={getCtorArgs}
      code={code}
      contract='OperatorFactory.sol:OperatorFactory'
      compiler={CompilerVersion.V0_8_17}
      license={LicenseType.BSL1_1}
      verifyURL={verifyURL}
      verifyKey={verifyKey}
      onMessage={onMessage}
      onError={onError}
    />
  );
}
