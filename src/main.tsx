import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import App from './App.tsx';
import './index.css';

import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { store } from "./app/store/store.ts";
import {CookiesProvider} from "react-cookie";
import {AuthProvider} from "./app/hooks/useAuth.tsx";

const container = document.getElementById('root');

const root = createRoot(container!);

root.render(
    <CookiesProvider>
        <Provider store={store}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Provider>
    </CookiesProvider>
);