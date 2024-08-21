import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import {
	loginFormSchema,
	LoginFormType,
	signupFormSchema,
	SignupFormType,
	UserServices,
} from './user.services';
import { BASE_API_URL } from '@/lib/constants';
import { useToast } from '@/components/ui/use-toast';
import { AxiosError } from 'axios';
import { QueryKeyEnums } from '../service.type';

export const useMe = () => {
	const { data, isPending } = useQuery({
		queryKey: [QueryKeyEnums.ME],
		queryFn: UserServices.me,
		staleTime: 15 * 60 * 1000, // 15 minutes in milliseconds
		retry: 0,
	});

	return { data: data?.data.data, isLoading: isPending };
};

export const useLogin = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { mutate, isPending } = useMutation({
		mutationFn: UserServices.login,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QueryKeyEnums.ME],
			});
		},
		onError: (e: AxiosError<{ message: string }>) => {
			toast({
				variant: 'destructive',
				description: e.response?.data.message,
			});
		},
	});

	const form = useForm<LoginFormType>({
		defaultValues: {
			email: 'test@email.com',
			password: 'Test1234',
		},
		resolver: zodResolver(loginFormSchema),
	});

	const onSubmit = async (data: LoginFormType) => {
		mutate(data);
	};

	const signInWithOauth = (provider: 'google' | 'facebook' | 'github') => {
		window.open(`${BASE_API_URL}/oauth/${provider}`, '_self');
	};

	return {
		onSubmit: form.handleSubmit(onSubmit),
		form,
		signInWithOauth,
		isLoading: form.formState.isSubmitting || isPending,
	};
};

export const useLogout = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { mutate } = useMutation({
		mutationFn: UserServices.logout,
		onSuccess: () => {
			queryClient.removeQueries();
		},
		onError: (e: AxiosError<{ message: string }>) => {
			toast({
				variant: 'destructive',
				description: e.response?.data.message,
			});
		},
	});

	return {
		logout: mutate,
	};
};

export const useSignup = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { mutate, isPending } = useMutation({
		mutationFn: UserServices.signup,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QueryKeyEnums.ME],
			});
		},
		onError: (e: AxiosError<{ message: string }>) => {
			toast({
				variant: 'destructive',
				description: e.response?.data.message,
			});
		},
	});

	const form = useForm<SignupFormType>({
		defaultValues: {
			firstName: 'test',
			lastName: 'user',
			email: 'test@email.com',
			password: 'Test1234',
			confirmPassword: 'Test1234',
		},
		resolver: zodResolver(signupFormSchema),
	});

	const onSubmit = async (data: SignupFormType) => {
		mutate({
			password: data.password,
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
		});
	};

	const signUpWithOauth = (provider: 'google' | 'facebook' | 'github') => {
		window.open(`${BASE_API_URL}/oauth/${provider}`, '_self');
	};

	return {
		onSubmit: form.handleSubmit(onSubmit),
		form,
		signUpWithOauth,
		isLoading: form.formState.isSubmitting || isPending,
	};
};
