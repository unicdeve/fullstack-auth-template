import {
	useLogin,
	useLogout,
	useMe,
	useSignup,
} from '@/services/user/user.service-hooks';
import { UserType } from '@/services/user/user.services';
import React, { createContext, useMemo } from 'react';

type AuthContextType = {
	user: UserType | null | undefined;
	logout(): void;
	isLoading: boolean;
	login: ReturnType<typeof useLogin>;
	signup: ReturnType<typeof useSignup>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
	const { logout } = useLogout();
	const login = useLogin();
	const signup = useSignup();

	const { data, isLoading } = useMe();

	const values = useMemo(
		() => ({
			user: data,
			isLoading: isLoading || login.isLoading || signup.isLoading,
			logout,
			login,
			signup,
		}),
		[data, isLoading, login, logout, signup]
	);

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
