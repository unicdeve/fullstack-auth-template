import { ResetPasswordForm } from '@/components/reset-password-form';

export const ResetPasswordPage = () => {
	return (
		<div className='flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
			<div className='mx-auto w-full max-w-md space-y-8'>
				<div className='text-center'>
					<h2 className='text-3xl font-bold tracking-tight text-foreground'>
						Reset Password
					</h2>
					<p className='mt-2 text-muted-foreground'>Set new password</p>
				</div>
				<ResetPasswordForm />
			</div>
		</div>
	);
};
