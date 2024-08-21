import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './pages';
import { AuthProvider } from './contexts/auth.context';
import { QueryClientProvider } from './services/query.client';
import { Toaster } from './components/ui/toaster';
import axios from 'axios';
import { BASE_API_URL } from './lib/constants';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = BASE_API_URL;

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<QueryClientProvider>
				<AuthProvider>
					<Toaster />
					<AppRoutes />
				</AuthProvider>
			</QueryClientProvider>
		</BrowserRouter>
	</StrictMode>
);
