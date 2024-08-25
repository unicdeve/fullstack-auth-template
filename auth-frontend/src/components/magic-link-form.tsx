'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Loader2 } from 'lucide-react';
import { useMagicLink } from '@/services/user/user.service-hooks';

export function MagicLinkForm() {
	const { onSubmit, form, isLoading } = useMagicLink();

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
					Request link
				</Button>
			</form>
		</Form>
	);
}
