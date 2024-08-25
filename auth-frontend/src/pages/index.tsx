import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './home';
import SignupPage from './sign-up';
import { LoginPage } from './login';
import { useAuth } from '@/hooks/use-auth.hook';
import { PropsWithChildren } from 'react';
import { VerifyMagicLink } from './magic-link-verify';

// You can create similar comp for protected routes
const PublicRoute = ({ children }: PropsWithChildren) => {
	const { user } = useAuth();

	if (user) return <Navigate to='/' />;

	return children;
};

export function AppRoutes() {
	const { user } = useAuth();

	return (
		<Routes>
			<Route
				path='/'
				element={user ? <HomePage /> : <Navigate to='/login' />}
			/>
			<Route path='/login' element={<PublicRoute children={<LoginPage />} />} />
			<Route
				path='/sign-up'
				element={<PublicRoute children={<SignupPage />} />}
			/>
			<Route
				path='/magic-link/verify'
				element={<PublicRoute children={<VerifyMagicLink />} />}
			/>
		</Routes>
	);
}
