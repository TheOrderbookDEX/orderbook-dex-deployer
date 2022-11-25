import { Container } from 'react-bootstrap';
import { useCallback } from 'react';
import RequireWallet from './RequireWallet';
import Messages, { useMessages } from './Messages';
import DeployV1 from './DeployV1';

function getErrorMessage(error: unknown) {
  try {
    return String((error as { message: unknown}).message);
  } catch {
    return String(error);
  }
}

export default function App() {
  const [ messages, addMessage, removeMessage ] = useMessages();

  const onError = useCallback((error: unknown) => {
    const message = getErrorMessage(error);
    if (/user rejected/i.test(message)) {
      return;
    }
    if (/aborted/.test(message)) {
      return;
    }
    console.error(error);
    addMessage({
      time: Date.now(),
      title: 'Error',
      body: <>{message}</>,
      variant: 'danger',
    });
  }, [ addMessage ]);

  return (
    <>
      <Container fluid="lg" className="my-2">
        <h1>The Orderbook DEX Deployer</h1>
        <hr />

        <RequireWallet onError={onError}>
          <DeployV1 onMessage={addMessage} onError={onError} />
        </RequireWallet>
      </Container>

      <Messages messages={messages} removeMessage={removeMessage} />
    </>
  );
}
