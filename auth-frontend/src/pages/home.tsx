import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth.hook';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
	const { user, isLoading, logout, logoutAll } = useAuth();

	if (isLoading) {
		return (
			<div className='flex min-h-screen flex-col items-center justify-center'>
				<div className='flex flex-col items-center'>
					<Loader2 className='mr-2 h-16 w-16 animate-spin' />
					<p>Loading user details...</p>
				</div>
			</div>
		);
	}

	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			{user && (
				<div className='flex flex-col gap-4'>
					<div>
						<span>User ID: </span>
						<span>{user.id}</span>
					</div>

					<div>
						<span>First name: </span>
						<span>{user.firstName}</span>
					</div>

					<div>
						<span>Last name: </span>
						<span>{user.lastName}</span>
					</div>

					<div>
						<span>Email: </span>
						<span>{user.email}</span>
					</div>
				</div>
			)}

			{user ? (
				<div className='flex flex-col gap-4'>
					<Button onClick={logoutAll}>Log out all devices</Button>
					<Button onClick={logout}>Log out</Button>
				</div>
			) : (
				<Link to='/login'>
					<Button>Login</Button>
				</Link>
			)}
		</main>
	);
};
