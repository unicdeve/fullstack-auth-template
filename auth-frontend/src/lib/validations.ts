import { z } from 'zod';

export const validateName = z.string().min(2, 'Please enter your full names');

export const validateEmail = z.string().email('Please enter a valid email');

export const validatePassword = z
	.string()
	.min(8, 'Password must be at least 8 characters');

export const confirmPassword = z
	.string({
		required_error: 'Confirm password is required',
	})
	.min(8, 'Password must be at least 8 characters');

type PasswordsType = {
	password: string;
	confirmPassword: string;
};

export const validateConfirmPassword = (
	{ confirmPassword, password }: PasswordsType,
	ctx: z.RefinementCtx
) => {
	if (confirmPassword !== password) {
		ctx.addIssue({
			code: 'custom',
			message: 'The passwords did not match',
			path: ['confirmPassword'],
		});
	}
};
