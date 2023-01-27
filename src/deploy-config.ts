import { ChainId } from './ethereum';

type DeployConfig = {
  readonly [chainId in ChainId]: {
    readonly signers: readonly string[];
    readonly signaturesRequired: bigint;
    readonly executionDelay: bigint;
  }
}

export const deployConfig: DeployConfig = {

  [ChainId.LOCALHOST]: {
    signers: [
      '0xc981049A919bb64AeA8a7b5DAa6D84f3BA1a624F',
    ],
    signaturesRequired: 0n,
    executionDelay: 15n * 60n,
  },

  [ChainId.GOERLI]: {
    signers: [
      '0xc981049A919bb64AeA8a7b5DAa6D84f3BA1a624F',
    ],
    signaturesRequired: 0n,
    executionDelay: 15n * 60n,
  },

  [ChainId.MAINNET]: {
    signers: [
    ],
    signaturesRequired: 0n,
    executionDelay: 7n * 24n * 60n * 60n,
  },

}
