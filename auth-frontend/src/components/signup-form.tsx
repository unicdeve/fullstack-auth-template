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
import { useAuth } from '@/hooks/use-auth.hook';
import { FacebookIcon } from './icons/facebook-icon';
import { GithubIcon } from './icons/github-icon';
import { GoogleIcon } from './icons/google-icon';

export function SignupForm() {
	const {
		signup: { signUpWithOauth, onSubmit, form },
		isLoading,
	} = useAuth();

	return (
		<div className='mx-auto w-full max-w-md space-y-8'>
			<Form {...form}>
				<form className='space-y-6' onSubmit={onSubmit}>
					<FormField
						control={form.control}
						name='firstName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>First name</FormLabel>
								<FormControl>
									<Input placeholder='Jane' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='lastName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last name</FormLabel>
								<FormControl>
									<Input placeholder='Doe' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

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

					<div className='flex items-center'>
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
					</div>
					<Button type='submit' className='w-full'>
						{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Create account
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
					onClick={() => signUpWithOauth('github')}
				>
					<GithubIcon className='mr-2 h-4 w-4' />
					Github
				</Button>
				<Button
					variant='outline'
					className='flex-1'
					onClick={() => signUpWithOauth('google')}
				>
					<GoogleIcon className='mr-2 h-4 w-4' />
					Google
				</Button>
				<Button
					variant='outline'
					className='flex-1'
					onClick={() => signUpWithOauth('facebook')}
				>
					<FacebookIcon className='mr-2 h-4 w-4' />
					Facebook
				</Button>
			</div>
		</div>
	);
}
