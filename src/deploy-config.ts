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
      '0x0F4b749Db51d860C34848ab8f8Fa4e185016e214',
      '0x6b5CCDF82058250e9B0086865CE8A0EBDc7df6D2',
      '0xB2Af7d6D5D12e31ae51a63d36AA10caC6226cFde',
      '0xC43680657E1e50CaC13cD3a5aE86670b946E51f3',
      '0xc981049A919bb64AeA8a7b5DAa6D84f3BA1a624F',
    ],
    signaturesRequired: 2n,
    executionDelay: 15n * 60n,
  },

  [ChainId.SEPOLIA]: {
    signers: [
      '0x0F4b749Db51d860C34848ab8f8Fa4e185016e214',
      '0x6b5CCDF82058250e9B0086865CE8A0EBDc7df6D2',
      '0xB2Af7d6D5D12e31ae51a63d36AA10caC6226cFde',
      '0xC43680657E1e50CaC13cD3a5aE86670b946E51f3',
      '0xc981049A919bb64AeA8a7b5DAa6D84f3BA1a624F',
    ],
    signaturesRequired: 2n,
    executionDelay: 15n * 60n,
  },

  [ChainId.GOERLI]: {
    signers: [
      '0x0F4b749Db51d860C34848ab8f8Fa4e185016e214',
      '0x6b5CCDF82058250e9B0086865CE8A0EBDc7df6D2',
      '0xB2Af7d6D5D12e31ae51a63d36AA10caC6226cFde',
      '0xC43680657E1e50CaC13cD3a5aE86670b946E51f3',
      '0xc981049A919bb64AeA8a7b5DAa6D84f3BA1a624F',
    ],
    signaturesRequired: 2n,
    executionDelay: 15n * 60n,
  },

  [ChainId.MAINNET]: {
    signers: [
    ],
    signaturesRequired: 0n,
    executionDelay: 7n * 24n * 60n * 60n,
  },

}
