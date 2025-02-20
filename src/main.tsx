import './index.css'
import App from './App.tsx'
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
    <App />
);