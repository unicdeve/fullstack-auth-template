import {
	confirmPassword,
	validateConfirmNewPassword,
	validateConfirmPassword,
	validateEmail,
	validateName,
	validatePassword,
} from '@/lib/validations';
import { z } from 'zod';
import axios from 'axios';

export const signupFormSchema = z
	.object({
		firstName: validateName,
		lastName: validateName,
		email: validateEmail,
		password: validatePassword,
		confirmPassword,
	})
	.superRefine(validateConfirmPassword);

export type SignupFormType = z.infer<typeof signupFormSchema>;

export const loginFormSchema = z.object({
	email: validateEmail,
	password: validatePassword,
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

export const magicLinkFormSchema = z.object({
	email: validateEmail,
});

export type MagicLinkFormType = z.infer<typeof magicLinkFormSchema>;

export const forgetPasswordFormSchema = z.object({
	email: validateEmail,
});

export type ForgetPasswordFormType = z.infer<typeof forgetPasswordFormSchema>;

export const resetPasswordFormSchema = z
	.object({
		newPassword: validatePassword,
		confirmPassword,
	})
	.superRefine(validateConfirmNewPassword);

export type ResetPasswordFormType = z.infer<typeof resetPasswordFormSchema>;

type RequestType<T> = {
	status: 'success';
	data: T;
	meta?: unknown;
};

export type UserType = {
	id: string;
	email: string;
	googleId: string | null;
	facebookId: string | null;
	firstName?: string;
	lastName: string;
};

type MeReturnType = RequestType<UserType>;

export const UserServices = {
	me: async function () {
		return await axios.get<MeReturnType>(`/local-auth/me`);
	},

	login: async function (data: LoginFormType) {
		return await axios.post(`/local-auth/signin-with-password`, data, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
	},

	logout: async function () {
		return await axios.delete(`/local-auth/logout`);
	},

	signup: async function (data: Omit<SignupFormType, 'confirmPassword'>) {
		return await axios.post(`/local-auth/signup-with-password`, data, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
	},

	requestMagicLink: async function (data: MagicLinkFormType) {
		return await axios.post(`/magic-link/request`, data, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
	},

	verifyMagicLinkToken: async function (token: string) {
		return await axios.get(`/magic-link/verify?token=${token}`);
	},

	forgetPassword: async function (data: ForgetPasswordFormType) {
		return await axios.post(`/forget-password`, data, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
	},

	resetPassword: async function (data: { newPassword: string; token: string }) {
		return await axios.post(`/forget-password/reset`, data, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
	},
};
