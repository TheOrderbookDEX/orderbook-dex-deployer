import { createAbortifier } from './utils';
import { useCallback } from 'react';
import { Message } from './Messages';
import { CompilerVersion, LicenseType } from './etherscan';
import { OrderbookDEXTeamTreasury } from '@theorderbookdex/orderbook-dex-team-treasury/dist/OrderbookDEXTeamTreasury';
import TreasuryInputJson from '@theorderbookdex/orderbook-dex-team-treasury/artifacts/OrderbookDEXTeamTreasury.input.json';
import Deployer from './Deployer';
import { deployConfig } from './deploy-config';
import { ChainId } from './ethereum';
import { abiencode } from '@frugalwizard/abi2ts-lib';

const code = JSON.stringify(TreasuryInputJson);

interface Properties {
  chainId: number;
  address: string;
  setAddress: (addressBook: string) => void;
  verifyURL?: string;
  verifyKey?: string;
  onMessage?: (message: Message) => void;
  onError?: (error: unknown) => void;
}

export default function TreasuryDeployer({
  chainId, address, setAddress, verifyURL, verifyKey, onMessage = console.log, onError = console.error
}: Properties) {

  const { signers, signaturesRequired, executionDelay } = deployConfig[chainId in ChainId ? chainId as ChainId : ChainId.MAINNET];

  const deployContract = useCallback(async (abortSignal?: AbortSignal) => {
    const abortify = createAbortifier(abortSignal);
    return (await abortify(OrderbookDEXTeamTreasury.deploy([...signers], signaturesRequired, executionDelay))).address;
  }, [ signers, signaturesRequired, executionDelay ]);

  const getDeployedCode = useCallback(async (abortSignal?: AbortSignal) => {
    const abortify = createAbortifier(abortSignal);
    return await abortify(OrderbookDEXTeamTreasury.callStatic.deploy([...signers], signaturesRequired, executionDelay));
  }, [ signers, signaturesRequired, executionDelay ]);

  const getCtorArgs = useCallback(() => {
    return abiencode(
      [ 'address[]', 'uint256', 'uint256' ],
      [ signers, signaturesRequired, executionDelay ]
    ).slice(2);
  }, [ signers, signaturesRequired, executionDelay ]);

  return (
    <Deployer
      title="Treasury"
      address={address}
      setAddress={setAddress}
      deployable={true}
      deployContract={deployContract}
      getDeployedCode={getDeployedCode}
      codeTolerance={104}
      getCtorArgs={getCtorArgs}
      code={code}
      contract='OrderbookDEXTeamTreasury.sol:OrderbookDEXTeamTreasury'
      compiler={CompilerVersion.V0_8_20}
      license={LicenseType.BSL1_1}
      verifyURL={verifyURL}
      verifyKey={verifyKey}
      onMessage={onMessage}
      onError={onError}
    />
  );
}
