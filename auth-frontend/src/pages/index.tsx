import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './home';
import { SignupPage } from './sign-up';
import { LoginPage } from './login';
import { useAuth } from '@/hooks/use-auth.hook';
import { PropsWithChildren } from 'react';
import { VerifyMagicLinkPage } from './magic-link-verify';
import { ForgetPasswordPage } from './forget-password';
import { ResetPasswordPage } from './forget-password/reset-password';

// You can create similar comp for protected routes
const PublicRoute = ({ children }: PropsWithChildren) => {
	const { user, isLoading } = useAuth();

	if (user && !isLoading) return <Navigate to='/' />;

	return children;
};

export function AppRoutes() {
	const { user, isLoading } = useAuth();

	return (
		<Routes>
			<Route
				path='/'
				element={user && !isLoading ? <HomePage /> : <Navigate to='/login' />}
			/>
			<Route path='/login' element={<PublicRoute children={<LoginPage />} />} />
			<Route
				path='/sign-up'
				element={<PublicRoute children={<SignupPage />} />}
			/>
			<Route
				path='/magic-link/verify'
				element={<PublicRoute children={<VerifyMagicLinkPage />} />}
			/>
			<Route
				path='/forget-password'
				element={<PublicRoute children={<ForgetPasswordPage />} />}
			/>
			<Route
				path='/forget-password/reset'
				element={<PublicRoute children={<ResetPasswordPage />} />}
			/>
		</Routes>
	);
}
