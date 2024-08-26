import { ForgetPasswordForm } from '@/components/forget-password-form';

export const ForgetPasswordPage = () => {
	return (
		<div className='flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
			<div className='mx-auto w-full max-w-md space-y-8'>
				<div className='text-center'>
					<h2 className='text-3xl font-bold tracking-tight text-foreground'>
						Forget Password
					</h2>
					<p className='mt-2 text-muted-foreground'>
						Enter your register email address
					</p>
				</div>
				<ForgetPasswordForm />
			</div>
		</div>
	);
};
