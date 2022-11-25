import { Form } from 'react-bootstrap';

interface Properties {
  password?: boolean;
  readOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export default function TaskInput({ password, readOnly, value, onChange }: Properties) {
  return (
    <Form.Control
      className="bg-body border-secondary text-body"
      type={password ? 'password' : 'text'}
      readOnly={readOnly}
      value={value}
      onChange={event => onChange?.(event.target.value)}
    />
  );
}
