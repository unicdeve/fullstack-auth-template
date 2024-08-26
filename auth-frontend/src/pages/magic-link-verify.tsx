import { useVerfiyMagicLink } from '@/services/user/user.service-hooks';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const VerifyMagicLinkPage = () => {
	const [searchParams] = useSearchParams();

	const token = searchParams.get('token') || '';

	const { verify } = useVerfiyMagicLink();

	useEffect(() => {
		verify(token);
	}, [token, verify]);

	return (
		<div className='flex min-h-screen flex-col items-center justify-center'>
			<div className='flex flex-col items-center'>
				<Loader2 className='mr-2 h-16 w-16 animate-spin' />
				<p>Verifying link...</p>
			</div>
		</div>
	);
};
