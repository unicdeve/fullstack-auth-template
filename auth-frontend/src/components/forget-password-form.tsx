'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Loader2 } from 'lucide-react';
import { useForgetPassword } from '@/services/user/user.service-hooks';
import { useSearchParams } from 'react-router-dom';

export function ForgetPasswordForm() {
	const [searchParams] = useSearchParams();

	const defaultEmail = searchParams.get('email') || '';

	const { onSubmit, form, isLoading } = useForgetPassword(defaultEmail);

	return (
		<Form {...form}>
			<form className='space-y-6' onSubmit={onSubmit}>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder='name@example.com' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' className='w-full'>
					{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
					Send
				</Button>
			</form>
		</Form>
	);
}
