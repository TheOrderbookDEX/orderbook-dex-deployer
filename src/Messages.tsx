import { Toast, ToastContainer } from 'react-bootstrap';
import { useState, ReactNode, useCallback } from 'react';

export interface Message {
  readonly time: number;
  readonly title: string;
  readonly body: ReactNode;
  readonly variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  readonly autohide?: boolean;
}

interface Properties {
  messages: readonly Message[];
  removeMessage: (message: Message) => void;
}

export function useMessages(): [ readonly Message[], (message: Message) => void, (message: Message) => void ] {
  const [ messages, setMessages ] = useState<readonly Message[]>([]);

  const addMessage = useCallback((message: Message) => {
    setMessages(messages => [ message, ...messages ]);
  }, []);

  const removeMessage = useCallback((message: Message) => {
    setMessages(messages => messages.filter(m => m !== message));
  }, []);

  return [ messages, addMessage, removeMessage ];
}

export default function Messages({ messages, removeMessage }: Properties) {

  return (
    <ToastContainer containerPosition="fixed" position="bottom-center" className="p-3">
      {messages.map(message =>
        <Toast
          key={message.time}
          onClose={() => removeMessage(message)}
          autohide={message.autohide}
          delay={5000}
        >
          <Toast.Header closeVariant="white" className={`text-white ${message.variant ? `bg-${message.variant}` : ''}`}>
            <strong className="me-auto">{message.title}</strong>
          </Toast.Header>
          <Toast.Body style={{ maxHeight: '10em', overflow: 'auto' }}>
            {message.body}
          </Toast.Body>
        </Toast>
      )}
    </ToastContainer>
  );
}
