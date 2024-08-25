'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth.hook';
import { FacebookIcon } from './icons/facebook-icon';
import { GithubIcon } from './icons/github-icon';
import { GoogleIcon } from './icons/google-icon';
import { MagicLinkForm } from './magic-link-form';

export function LoginForm() {
	const {
		login: { signInWithOauth, onSubmit, form },
		isLoading,
	} = useAuth();

	return (
		<div className='mx-auto w-full max-w-md space-y-8'>
			<Form {...form}>
				<form className='space-y-6' onSubmit={onSubmit}>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email address</FormLabel>
								<FormControl>
									<Input placeholder='name@example.com' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
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

					<div className='flex items-center justify-between'>
						<div className='flex items-center'>
							<Checkbox
								id='remember-me'
								name='remember-me'
								className='h-4 w-4 rounded'
							/>
							<Label
								htmlFor='remember-me'
								className='ml-2 block text-sm text-foreground'
							>
								Remember me
							</Label>
						</div>
						<div className='text-sm'>
							<Link to='#' className='font-medium text-primary hover:underline'>
								Forgot your password?
							</Link>
						</div>
					</div>
					<Button type='submit' className='w-full'>
						{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Sign in
					</Button>
				</form>
			</Form>
			<div className='relative'>
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t border-muted' />
				</div>
				<div className='relative flex justify-center text-sm'>
					<span className='bg-background px-2 text-muted-foreground'>
						Or continue with
					</span>
				</div>
			</div>
			<div className='flex gap-2'>
				<Button
					variant='outline'
					className='flex-1'
					onClick={() => signInWithOauth('github')}
				>
					<GithubIcon className='mr-2 h-4 w-4' />
					Github
				</Button>
				<Button
					variant='outline'
					className='flex-1'
					onClick={() => signInWithOauth('google')}
				>
					<GoogleIcon className='mr-2 h-4 w-4' />
					Google
				</Button>
				<Button
					variant='outline'
					className='flex-1'
					onClick={() => signInWithOauth('facebook')}
				>
					<FacebookIcon className='mr-2 h-4 w-4' />
					Facebook
				</Button>
			</div>

			<div className='relative'>
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t border-muted' />
				</div>
				<div className='relative flex justify-center text-sm'>
					<span className='bg-background px-2 text-muted-foreground'>
						Or continue with magic link
					</span>
				</div>
			</div>

			<MagicLinkForm />
		</div>
	);
}
