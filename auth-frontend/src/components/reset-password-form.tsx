'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';
import { Loader2 } from 'lucide-react';
import { useResetPassword } from '@/services/user/user.service-hooks';
import { useSearchParams } from 'react-router-dom';

export function ResetPasswordForm() {
	const [searchParams] = useSearchParams();

	const token = searchParams.get('token') || '';

	const { onSubmit, form, isLoading } = useResetPassword(token);

	return (
		<Form {...form}>
			<form className='space-y-6' onSubmit={onSubmit}>
				<FormField
					control={form.control}
					name='newPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<Input
									type='password'
									autoComplete='current-password'
									placeholder='••••••••'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='confirmPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm password</FormLabel>
							<FormControl>
								<Input
									type='password'
									autoComplete='current-password'
									placeholder='••••••••'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' className='w-full'>
					{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
					Set new password
				</Button>
			</form>
		</Form>
	);
}
