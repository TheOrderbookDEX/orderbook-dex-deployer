import { ChainId } from './ethereum';
import { sleep } from './utils';

export enum CompilerVersion {
  V0_8_15 = 'v0.8.15+commit.e14f2714',
  V0_8_17 = 'v0.8.17+commit.8df45f5f',
}

export enum LicenseType {
  MIT = '3',
  BSL1_1 = '14',
}

export function getVerifyURL(chainId: number): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return 'https://api.etherscan.io/api';

    case ChainId.GOERLI:
      return 'https://api-goerli.etherscan.io/api';

    default:
      return '';
  }
}

export async function verifyContract({ apiURL, apiKey, address, code, contract, compiler, license, args, abortSignal }: {
  apiURL: string;
  apiKey: string;
  address: string;
  code: string;
  contract: string;
  compiler: CompilerVersion;
  license: LicenseType;
  args?: string;
  abortSignal?: AbortSignal;
}) {
  const formData = new FormData();
  formData.append('apikey', apiKey);
  formData.append('module', 'contract');
  formData.append('action', 'verifysourcecode');
  formData.append('contractaddress', address);
  formData.append('codeformat', 'solidity-standard-json-input');
  formData.append('sourceCode', code);
  formData.append('contractname', contract);
  formData.append('compilerversion', compiler);
  formData.append('licenseType', license);
  if (args) {
    formData.append('constructorArguements', args);
  }

  const { status, result }: { status: string, result: string } = await fetch(apiURL, {
    method: 'POST',
    body: formData,
    signal: abortSignal,
  }).then(response => response.json());

  if (status === '1') {
    const guid = result;

    while (true) {
      await sleep(10000, abortSignal);

      const formData = new FormData();
      formData.append('apikey', apiKey);
      formData.append('module', 'contract');
      formData.append('action', 'checkverifystatus');
      formData.append('guid', guid);

      const { status, result }: { status: string, result: string } = await fetch(apiURL, {
        method: 'POST',
        body: formData,
        signal: abortSignal,
      }).then(response => response.json());

      if (status === '1') {
        return;

      } else if (/pending/i.test(result)) {
        continue;

      } else {
        throw new Error(result);
      }
    }

  } else {
    throw new Error(result);
  }
}
