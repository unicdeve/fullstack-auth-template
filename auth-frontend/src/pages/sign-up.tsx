/**
 * v0 by Vercel.
 * @see https://v0.dev/t/5wt6iYMtE3X
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { SignupForm } from '@/components/signup-form';
import { Link } from 'react-router-dom';

export const SignupPage = () => {
	return (
		<div className='flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
			<div className='mx-auto w-full max-w-md space-y-8'>
				<div className='text-center'>
					<h2 className='text-3xl font-bold tracking-tight text-foreground'>
						Create a new account
					</h2>
					<p className='mt-2 text-muted-foreground'>
						Already have an account?{' '}
						<Link
							to='/login'
							className='font-medium text-primary hover:underline'
						>
							Login
						</Link>
					</p>
				</div>
				<SignupForm />
			</div>
		</div>
	);
};
