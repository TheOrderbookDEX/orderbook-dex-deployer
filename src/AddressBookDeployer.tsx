import { createAbortifier } from './utils';
import { useCallback } from 'react';
import { Message } from './Messages';
import { CompilerVersion, LicenseType } from './etherscan';
import { AddressBook } from '@frugal-wizard/addressbook/dist/AddressBook';
import AddressBookInputJson from '@frugal-wizard/addressbook/artifacts/AddressBook.input.json';
import Deployer from './Deployer';

const code = JSON.stringify(AddressBookInputJson);

interface Properties {
  address: string;
  setAddress: (addressBook: string) => void;
  verifyURL?: string;
  verifyKey?: string;
  onMessage?: (message: Message) => void;
  onError?: (error: unknown) => void;
}

export default function AddressBookDeployer({
  address, setAddress, verifyURL, verifyKey, onMessage = console.log, onError = console.error
}: Properties) {

  const deployContract = useCallback(async (abortSignal?: AbortSignal) => {
    const abortify = createAbortifier(abortSignal);
    return (await abortify(AddressBook.deploy())).address;
  }, []);

  const getDeployedCode = useCallback(async (abortSignal?: AbortSignal) => {
    const abortify = createAbortifier(abortSignal);
    return await abortify(AddressBook.callStatic.deploy());
  }, []);

  const getCtorArgs = useCallback(() => undefined, []);

  return (
    <Deployer
      title="Address Book"
      address={address}
      setAddress={setAddress}
      deployable={true}
      deployContract={deployContract}
      getDeployedCode={getDeployedCode}
      getCtorArgs={getCtorArgs}
      code={code}
      contract='AddressBook.sol:AddressBook'
      compiler={CompilerVersion.V0_8_17}
      license={LicenseType.MIT}
      verifyURL={verifyURL}
      verifyKey={verifyKey}
      onMessage={onMessage}
      onError={onError}
    />
  );
}
