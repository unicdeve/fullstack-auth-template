import { PropsWithChildren } from 'react';

import {
	QueryClient,
	QueryClientProvider as ClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

export const QueryClientProvider = ({ children }: PropsWithChildren) => {
	return <ClientProvider client={queryClient}>{children}</ClientProvider>;
};
