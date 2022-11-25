import { Form, InputGroup } from 'react-bootstrap';
import { useMemo } from 'react';
import TaskCheck from './TaskCheck';
import TaskInput from './TaskInput';

interface Properties {
  apiKey: string;
  setApiKey: (apiKey: string) => void;
}

export default function EtherscanAPIKey({ apiKey, setApiKey }: Properties) {
  const complete = useMemo(() => Boolean(apiKey), [ apiKey ]);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Etherscan API Key</Form.Label>
      <InputGroup>
        <TaskCheck complete={complete} />
        <TaskInput password value={apiKey} onChange={setApiKey} />
      </InputGroup>
    </Form.Group>
  );
}
