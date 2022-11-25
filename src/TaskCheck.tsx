import { Form, InputGroup, Spinner } from 'react-bootstrap';

interface TaskCheckProps {
  loading?: boolean;
  complete?: boolean
}

export default function TaskCheck({ loading, complete }: TaskCheckProps) {
  return (
    <InputGroup.Text className="bg-body border-secondary text-body">
      { loading ?
        <Spinner animation="border" size="sm" />
      :
        <Form.Check.Input className={`${complete ? 'bg-success' : 'bg-body'} border-secondary text-body`} readOnly checked={complete} />
      }
    </InputGroup.Text>
  );
}
