import { getAccounts, hexstring } from '@frugalwizard/abi2ts-lib';
import { createAbortifier } from './utils';

export interface Ethereum {
  isMetaMask?: boolean;
  request(args: { method: 'eth_chainId' }): Promise<string>;
  request(args: { method: 'eth_accounts' }): Promise<string[]>;
  request(args: { method: 'eth_requestAccounts' }): Promise<string[]>;
  request(args: { method: 'eth_getCode', params: [string] }): Promise<string>;
  on(eventName: 'chainChanged', listener: (chainId: string) => void): void;
  on(eventName: 'accountsChanged', listener: (accounts: string[]) => void): void;
}

const global = globalThis as { ethereum?: Ethereum };

export function getEthereum() {
  if ('ethereum' in global && global.ethereum) {
    return global.ethereum;
  }
  throw new Error('No ethereum provider');
}

export function isAddress(value: string): boolean {
  return /^0x[0-9a-f]{40}$/.test(value.toLowerCase());
}

export enum ChainId {
  MAINNET = 1,
  GOERLI = 5,
  LOCALHOST = 1337,
}

export async function getChainId(abortSignal?: AbortSignal) {
  const abortify = createAbortifier(abortSignal);
  const ethereum = getEthereum();
  return Number(await abortify(ethereum.request({ method: 'eth_chainId' })));
}

export async function getAccount(abortSignal?: AbortSignal): Promise<string> {
  const abortify = createAbortifier(abortSignal);
  return (await abortify(getAccounts()))[0];
}

export async function getCode(address: string, abortSignal?: AbortSignal): Promise<string> {
  const abortify = createAbortifier(abortSignal);
  const ethereum = getEthereum();
  return await abortify(ethereum.request({ method: 'eth_getCode', params: [address] }));
}

export function isSameCode(a: string, b: string, tolerance: number): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) diff++;
    if (diff > tolerance) return false;
  }
  return true;
}

// We need these to interact directly with ganache to set the account balance

export async function getDevBalance(abortSignal?: AbortSignal): Promise<bigint> {
  const account = await getAccount(abortSignal);
  const { result } = await fetch('http://localhost:8545', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [ account ],
    }),
    signal: abortSignal,
  }).then(result => result.json());
  return BigInt(result);
}

export async function setDevBalance(balance: bigint, abortSignal?: AbortSignal) {
  const account = await getAccount(abortSignal);
  await fetch('http://localhost:8545', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'evm_setAccountBalance',
      params: [ account, hexstring(balance) ],
    }),
    signal: abortSignal,
  });
}
