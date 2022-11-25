import { createAbortifier } from './utils';
import { useCallback } from 'react';
import { Message } from './Messages';
import { CompilerVersion, LicenseType } from './etherscan';
import { abiencode } from '@frugal-wizard/abi2ts-lib';
import { ERC20WithFaucet } from '@theorderbookdex/orderbook-dex/dist/testing/ERC20WithFaucet';
import ERC20WithFaucetInputJson from '@theorderbookdex/orderbook-dex/artifacts/testing/ERC20WithFaucet.input.json';
import Deployer from './Deployer';

const code = JSON.stringify(ERC20WithFaucetInputJson);

interface Properties {
  name: string;
  symbol: string;
  decimals: number;
  faucetAmount: bigint;
  faucetCooldown: bigint;
  address: string;
  setAddress: (addressBook: string) => void;
  verifyURL?: string;
  verifyKey?: string;
  onMessage?: (message: Message) => void;
  onError?: (error: unknown) => void;
}

export default function FakeERC20Deployer({
  name, symbol, decimals, faucetAmount, faucetCooldown, address, setAddress, verifyURL, verifyKey, onMessage = console.log, onError = console.error
}: Properties) {

  const deployContract = useCallback(async (abortSignal?: AbortSignal) => {
    const abortify = createAbortifier(abortSignal);
    return (await abortify(ERC20WithFaucet.deploy(name, symbol, decimals, faucetAmount, faucetCooldown))).address;
  }, [ decimals, faucetAmount, faucetCooldown, name, symbol ]);

  const getDeployedCode = useCallback(async (abortSignal?: AbortSignal) => {
    const abortify = createAbortifier(abortSignal);
    return await abortify(ERC20WithFaucet.callStatic.deploy(name, symbol, decimals, faucetAmount, faucetCooldown));
  }, [ decimals, faucetAmount, faucetCooldown, name, symbol ]);

  const getCtorArgs = useCallback(() => {
    return abiencode(
      [ 'string', 'string', 'uint8', 'uint256', 'uint256' ],
      [ name, symbol, decimals, faucetAmount, faucetCooldown ]
    ).slice(2);
  }, [ name, symbol, decimals, faucetAmount, faucetCooldown ]);

  return (
    <Deployer
      title={`${name} (${symbol})`}
      address={address}
      setAddress={setAddress}
      deployable={true}
      deployContract={deployContract}
      getDeployedCode={getDeployedCode}
      getCtorArgs={getCtorArgs}
      code={code}
      contract='testing/ERC20WithFaucet.sol:ERC20WithFaucet'
      compiler={CompilerVersion.V0_8_17}
      license={LicenseType.BSL1_1}
      verifyURL={verifyURL}
      verifyKey={verifyKey}
      onMessage={onMessage}
      onError={onError}
    />
  );
}
