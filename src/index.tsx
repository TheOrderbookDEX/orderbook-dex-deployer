import { createRoot } from 'react-dom/client';
import 'bootswatch/dist/slate/bootstrap.min.css';
import App from './App';

createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);
