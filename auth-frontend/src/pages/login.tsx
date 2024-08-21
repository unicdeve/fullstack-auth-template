/**
 * v0 by Vercel.
 * @see https://v0.dev/t/5wt6iYMtE3X
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { LoginForm } from '@/components/login-form';
import { Link } from 'react-router-dom';

export function LoginPage() {
	return (
		<div className='flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
			<div className='mx-auto w-full max-w-md space-y-8'>
				<div className='text-center'>
					<h2 className='text-3xl font-bold tracking-tight text-foreground'>
						Sign in to your account
					</h2>
					<p className='mt-2 text-muted-foreground'>
						Don&rsquo;t have an account?{' '}
						<Link
							to='/sign-up'
							className='font-medium text-primary hover:underline'
						>
							Register
						</Link>
					</p>
				</div>
				<LoginForm />
			</div>
		</div>
	);
}
