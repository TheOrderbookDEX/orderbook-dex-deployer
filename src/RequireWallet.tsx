import { useCallback, useEffect, useState, ReactNode } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Ethereum, getEthereum } from './ethereum';

interface Properties {
  onError?: (error: unknown) => void;
  children: ReactNode;
}

export default function RequireWallet({ children, onError = console.error }: Properties) {
  const [ ethereum, setEthereum ] = useState<Ethereum>();

  useEffect(() => {
    try {
      const ethereum = getEthereum();
      ethereum.on('chainChanged', () => window.location.reload());
      setEthereum(ethereum);

    } catch (error) {
      onError(error);
    }
  }, [ onError ]);

  const [ connected, setConnected ] = useState(false);
  const [ connecting, setConnecting ] = useState(true);

  useEffect(() => {
    if (!ethereum) return;

    setConnecting(true);
    setConnected(false);

    void (async () => {
      try {
        const [ account ] = await ethereum.request({ method: 'eth_accounts' });
        setConnected(Boolean(account));
        setConnecting(false);

      } catch (error) {
        onError(error);

      } finally {
        setConnecting(false);
      }
    })();
  }, [ ethereum, onError ]);

  const connect = useCallback(() => {
    if (!ethereum) return;

    setConnecting(true);
    setConnected(false);

    void (async () => {
      try {
        await ethereum.request({ method: 'eth_requestAccounts' });
        setConnected(true);
        setConnecting(false);

      } catch (error) {
        onError(error);

      } finally {
        setConnecting(false);
      }
    })();
  }, [ ethereum, onError ]);

  return (
    <>
      { connected ?
        children

      :
        <fieldset className="border border-primary p-3">
          <legend className="float-none w-auto m-0">Connect to wallet</legend>

          <div className="text-center">
            <Button
              className="text-uppercase"
              variant="success"
              disabled={connecting}
              onClick={connect}
            >
              { connecting ?
                <><Spinner animation="border" size="sm" /> Connecting...</>

              :
                <>Connect</>
              }
            </Button>
          </div>
        </fieldset>
      }
    </>
  );
}
