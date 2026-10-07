import { createRoot } from 'react-dom/client';
import App from './App';
import TitleBar from './components/TitleBar';

const root = createRoot(document.getElementById('root')!);
root.render(
  <>
    <TitleBar />
    <App />
  </>,
);
