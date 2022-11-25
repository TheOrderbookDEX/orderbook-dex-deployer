import { InputGroup } from 'react-bootstrap';
import { ReactNode } from 'react';

interface Properties {
  grow?: boolean;
  uppercase?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  children?: ReactNode;
}

export default function TaskText({ grow, uppercase, variant, children }: Properties) {
  return (
    <InputGroup.Text className={`bg-body border-secondary ${ grow ? 'flex-grow-1' : '' } ${ uppercase ? 'text-uppercase' : '' } ${ variant ? `text-${variant}` : 'text-body' }`}>
      {children}
    </InputGroup.Text>
  );
}
