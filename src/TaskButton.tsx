import { Button } from 'react-bootstrap';
import { ReactNode } from 'react';

interface Properties {
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

export default function TaskButton({ disabled, onClick, children }: Properties) {
  return (
    <Button variant="outline-primary" className="border-secondary text-uppercase" disabled={disabled} onClick={onClick}>{children}</Button>
  );
}
