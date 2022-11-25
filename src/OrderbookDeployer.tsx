import { createAbortifier, is } from './utils';
import { useCallback, useMemo } from 'react';
import { Message } from './Messages';
import { isAddress } from './ethereum';
import { CompilerVersion, LicenseType } from './etherscan';
import { abiencode } from '@frugal-wizard/abi2ts-lib';
import { OrderbookFactoryV1 } from '@theorderbookdex/orderbook-dex-v1/dist/OrderbookFactoryV1';
import { OrderbookCreated } from '@theorderbookdex/orderbook-dex/dist/interfaces/IOrderbookFactory';
import { OrderbookV1 } from '@theorderbookdex/orderbook-dex-v1/dist/OrderbookV1';
import OrderbookV1InputJson from '@theorderbookdex/orderbook-dex-v1/artifacts/OrderbookV1.input.json';
import Deployer from './Deployer';

const code = JSON.stringify(OrderbookV1InputJson);

interface Properties {
  name: string;
  orderbookFactory: string;
  tradedToken: string;
  baseToken: string;
  contractSize: bigint;
  priceTick: bigint;
  address: string;
  setAddress: (addressBook: string) => void;
  verifyURL?: string;
  verifyKey?: string;
  onMessage?: (message: Message) => void;
  onError?: (error: unknown) => void;
}

export default function OrderbookDeployer({
  name, orderbookFactory, tradedToken, baseToken, contractSize, priceTick, address, setAddress, verifyURL, verifyKey, onMessage = console.log, onError = console.error
}: Properties) {

  const deployable = useMemo(() => isAddress(orderbookFactory) && isAddress(tradedToken) && isAddress(baseToken), [ orderbookFactory, tradedToken, baseToken ]);

  const deployContract = useCallback(async (abortSignal?: AbortSignal) => {
    const abortify = createAbortifier(abortSignal);
    const { events } = await abortify(OrderbookFactoryV1.at(orderbookFactory).createOrderbook(tradedToken, baseToken, contractSize, priceTick));
    const [{ orderbook }] = events.filter(is(OrderbookCreated));
    return orderbook;
  }, [ orderbookFactory, tradedToken, baseToken, contractSize, priceTick ]);

  const getDeployedCode = useCallback(async (abortSignal?: AbortSignal) => {
    const abortify = createAbortifier(abortSignal);
    const addressBook = await abortify(OrderbookFactoryV1.at(orderbookFactory).addressBook());
    return await abortify(OrderbookV1.callStatic.deploy(addressBook, tradedToken, baseToken, contractSize, priceTick));
  }, [ orderbookFactory, tradedToken, baseToken, contractSize, priceTick ]);

  const getCtorArgs = useCallback(async (abortSignal?: AbortSignal) => {
    const abortify = createAbortifier(abortSignal);
    const addressBook = await abortify(OrderbookFactoryV1.at(orderbookFactory).addressBook());
    return abiencode(
      [ 'address', 'address', 'address', 'uint256', 'uint256' ],
      [ addressBook, tradedToken, baseToken, contractSize, priceTick ]
    ).slice(2);
  }, [ orderbookFactory, tradedToken, baseToken, contractSize, priceTick ]);

  return (
    <Deployer
      title={name}
      address={address}
      setAddress={setAddress}
      deployable={deployable}
      deployContract={deployContract}
      getDeployedCode={getDeployedCode}
      getCtorArgs={getCtorArgs}
      code={code}
      contract='OrderbookV1.sol:OrderbookV1'
      compiler={CompilerVersion.V0_8_17}
      license={LicenseType.BSL1_1}
      verifyURL={verifyURL}
      verifyKey={verifyKey}
      onMessage={onMessage}
      onError={onError}
    />
  );
}
