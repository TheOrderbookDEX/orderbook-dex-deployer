import { createAbortifier } from './utils';
import { useCallback, useMemo } from 'react';
import { Message } from './Messages';
import { CompilerVersion, LicenseType } from './etherscan';
import { isAddress } from './ethereum';
import { abiencode } from '@frugal-wizard/abi2ts-lib';
import { OrderbookFactoryV1 } from '@theorderbookdex/orderbook-dex-v1/dist/OrderbookFactoryV1';
import OrderbookFactoryV1InputJson from '@theorderbookdex/orderbook-dex-v1/artifacts/OrderbookFactoryV1.input.json';
import Deployer from './Deployer';

const code = JSON.stringify(OrderbookFactoryV1InputJson);

interface Properties {
  treasury: string;
  addressBook: string;
  address: string;
  setAddress: (addressBook: string) => void;
  verifyURL?: string;
  verifyKey?: string;
  onMessage?: (message: Message) => void;
  onError?: (error: unknown) => void;
}

export default function OrderbookFactoryDeployer({
  treasury, addressBook, address, setAddress, verifyURL, verifyKey, onMessage = console.log, onError = console.error
}: Properties) {

  const deployable = useMemo(() => isAddress(treasury) && isAddress(addressBook), [ treasury, addressBook ]);

  const deployContract = useCallback(async (abortSignal?: AbortSignal) => {
    const abortify = createAbortifier(abortSignal);
    return (await abortify(OrderbookFactoryV1.deploy(treasury, addressBook))).address;
  }, [ treasury, addressBook ]);

  const getDeployedCode = useCallback(async (abortSignal?: AbortSignal) => {
    const abortify = createAbortifier(abortSignal);
    return await abortify(OrderbookFactoryV1.callStatic.deploy(treasury, addressBook));
  }, [ treasury, addressBook ]);

  const getCtorArgs = useCallback(() => {
    return abiencode(
      [ 'address', 'address' ],
      [ treasury, addressBook ]
    ).slice(2);
  }, [ treasury, addressBook ]);

  return (
    <Deployer
      title="Orderbook Factory"
      address={address}
      setAddress={setAddress}
      deployable={deployable}
      deployContract={deployContract}
      getDeployedCode={getDeployedCode}
      getCtorArgs={getCtorArgs}
      code={code}
      contract='OrderbookFactoryV1.sol:OrderbookFactoryV1'
      compiler={CompilerVersion.V0_8_17}
      license={LicenseType.BSL1_1}
      verifyURL={verifyURL}
      verifyKey={verifyKey}
      onMessage={onMessage}
      onError={onError}
    />
  );
}
