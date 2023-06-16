import { Spinner } from 'react-bootstrap';
import { useEffect, useMemo, useState } from 'react';
import { asyncEffect } from './utils';
import { ChainId, getChainId } from './ethereum';
import { getVerifyURL } from './etherscan';
import { parseValue } from '@frugalwizard/abi2ts-lib';
import { Message } from './Messages';
import AddressBookDeployer from './AddressBookDeployer';
import AccountBalance from './AccountBalance';
import OrderbookFactoryDeployer from './OrderbookFactoryDeployer';
import FakeERC20Deployer from './FakeERC20Deployer';
import OrderbookDeployer from './OrderbookDeployer';
import OperatorFactoryDeployer from './OperatorFactoryDeployer';
import OperatorV1Deployer from './OperatorV1Deployer';
import EtherscanAPIKey from './EtherscanAPIKey';
import TreasuryDeployer from './TreasuryDeployer';

const ONE_DAY = 24n * 60n * 60n;

interface Properties {
  onMessage?: (message: Message) => void;
  onError?: (error: unknown) => void;
}

export default function DeployV1({ onMessage = console.log, onError = console.error }: Properties) {
  const [ loading, setLoading ] = useState(true);

  const [ chainId, setChainId ] = useState(0);

  useEffect(() => asyncEffect(async (abortSignal) => {
    setLoading(true);
    setChainId(await getChainId(abortSignal));
    setLoading(false);
  }), []);

  const testnet = useMemo(() => [ ChainId.LOCALHOST, ChainId.GOERLI, ChainId.SEPOLIA ].includes(chainId), [ chainId ]);

  const verifyURL = useMemo(() => getVerifyURL(chainId), [ chainId ]);

  const [ verifyKey, setVerifyKey ] = useState('');

  const [ treasury, setTreasury ] = useState('');
  const [ addressBook, setAddressBook ] = useState('');
  const [ orderbookFactory, setOrderbookFactory ] = useState('');
  const [ WBTC, setWBTC ] = useState('');
  const [ WETH, setWETH ] = useState('');
  const [ BNB,  setBNB  ] = useState('');
  const [ WXRP, setWXRP ] = useState('');
  const [ USDT, setUSDT ] = useState('');
  const [ WBTCtoUSDT, setWBTCtoUSDT ] = useState('');
  const [ WETHtoUSDT, setWETHtoUSDT ] = useState('');
  const [ BNBtoUSDT,  setBNBtoUSDT  ] = useState('');
  const [ WXRPtoUSDT, setWXRPtoUSDT ] = useState('');
  const [ operatorFactory, setOperatorFactory ] = useState('');
  const [ operatorV1, setOperatorV1 ] = useState('');

  return (
    <fieldset className="border border-primary p-3 mb-3">
      <legend className="float-none w-auto m-0">Deploy V1</legend>

      {loading ?
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      :
        <>
          {chainId === ChainId.LOCALHOST &&
            <AccountBalance />
          }

          {verifyURL &&
            <EtherscanAPIKey
              apiKey={verifyKey}
              setApiKey={setVerifyKey}
            />
          }

          <TreasuryDeployer
            chainId={chainId}
            address={treasury}
            setAddress={setTreasury}
            verifyURL={verifyURL}
            verifyKey={verifyKey}
            onMessage={onMessage}
            onError={onError}
          />

          <AddressBookDeployer
            address={addressBook}
            setAddress={setAddressBook}
            verifyURL={verifyURL}
            verifyKey={verifyKey}
            onMessage={onMessage}
            onError={onError}
          />

          <OrderbookFactoryDeployer
            treasury={treasury}
            addressBook={addressBook}
            address={orderbookFactory}
            setAddress={setOrderbookFactory}
            verifyURL={verifyURL}
            verifyKey={verifyKey}
            onMessage={onMessage}
            onError={onError}
          />

          {testnet && <>
            <FakeERC20Deployer
              name="Fake Wrapped BTC"
              symbol="WBTC"
              decimals={18}
              faucetAmount={parseValue(1000)}
              faucetCooldown={ONE_DAY}
              address={WBTC}
              setAddress={setWBTC}
              verifyURL={verifyURL}
              verifyKey={verifyKey}
              onMessage={onMessage}
              onError={onError}
            />

            <FakeERC20Deployer
              name="Fake Wrapped Ether"
              symbol="WETH"
              decimals={18}
              faucetAmount={parseValue(1000)}
              faucetCooldown={ONE_DAY}
              address={WETH}
              setAddress={setWETH}
              verifyURL={verifyURL}
              verifyKey={verifyKey}
              onMessage={onMessage}
              onError={onError}
            />

            <FakeERC20Deployer
              name="Fake BNB"
              symbol="BNB"
              decimals={18}
              faucetAmount={parseValue(1000)}
              faucetCooldown={ONE_DAY}
              address={BNB}
              setAddress={setBNB}
              verifyURL={verifyURL}
              verifyKey={verifyKey}
              onMessage={onMessage}
              onError={onError}
            />

            <FakeERC20Deployer
              name="Fake Wrapped XRP"
              symbol="WXRP"
              decimals={18}
              faucetAmount={parseValue(1000)}
              faucetCooldown={ONE_DAY}
              address={WXRP}
              setAddress={setWXRP}
              verifyURL={verifyURL}
              verifyKey={verifyKey}
              onMessage={onMessage}
              onError={onError}
            />

            <FakeERC20Deployer
              name="Fake Tether USD"
              symbol="USDT"
              decimals={6}
              faucetAmount={parseValue(1000000, 6)}
              faucetCooldown={ONE_DAY}
              address={USDT}
              setAddress={setUSDT}
              verifyURL={verifyURL}
              verifyKey={verifyKey}
              onMessage={onMessage}
              onError={onError}
            />

            <OrderbookDeployer
              name="WBTC/USDT"
              orderbookFactory={orderbookFactory}
              tradedToken={WBTC}
              baseToken={USDT}
              contractSize={1000000000000000n}
              priceTick={100000n}
              address={WBTCtoUSDT}
              setAddress={setWBTCtoUSDT}
              verifyURL={verifyURL}
              verifyKey={verifyKey}
              onMessage={onMessage}
              onError={onError}
            />

            <OrderbookDeployer
              name="WETH/USDT"
              orderbookFactory={orderbookFactory}
              tradedToken={WETH} baseToken={USDT}
              contractSize={10000000000000000n}
              priceTick={100000n}
              address={WETHtoUSDT}
              setAddress={setWETHtoUSDT}
              verifyURL={verifyURL}
              verifyKey={verifyKey}
              onMessage={onMessage}
              onError={onError}
            />

            <OrderbookDeployer
              name="BNB/USDT"
              orderbookFactory={orderbookFactory}
              tradedToken={BNB}
              baseToken={USDT}
              contractSize={100000000000000000n}
              priceTick={100000n}
              address={BNBtoUSDT}
              setAddress={setBNBtoUSDT}
              verifyURL={verifyURL}
              verifyKey={verifyKey}
              onMessage={onMessage}
              onError={onError}
            />

            <OrderbookDeployer
              name="WXRP/USDT"
              orderbookFactory={orderbookFactory}
              tradedToken={WXRP}
              baseToken={USDT}
              contractSize={1000000000000000000n}
              priceTick={10000n}
              address={WXRPtoUSDT}
              setAddress={setWXRPtoUSDT}
              verifyURL={verifyURL}
              verifyKey={verifyKey}
              onMessage={onMessage}
              onError={onError}
            />

          </>}

          <OperatorFactoryDeployer
            addressBook={addressBook}
            address={operatorFactory}
            setAddress={setOperatorFactory}
            verifyURL={verifyURL}
            verifyKey={verifyKey}
            onMessage={onMessage}
            onError={onError}
          />

          <OperatorV1Deployer
            operatorFactory={operatorFactory}
            address={operatorV1}
            setAddress={setOperatorV1}
            verifyURL={verifyURL}
            verifyKey={verifyKey}
            onMessage={onMessage}
            onError={onError}
          />
        </>
      }
    </fieldset>
  );
}
