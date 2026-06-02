'use client';

import {QueryClient} from '@tanstack/react-query'
import {persistQueryClient} from '@tanstack/react-query-persist-client';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';

// persist 생성
const persister = createAsyncStoragePersister({
	storage: typeof window !== 'undefined' ? window.sessionStorage : null,
});

// QueryClient 인스턴스 생성
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 24 * 7, // 가비지 컬렉션
			staleTime: 1000 * 60 * 5, // 데이터 fetch 상태 유지
		},
		mutations: {
			retry: 0,
		},
	},
});

persistQueryClient({
	queryClient,
	persister: persister,
	maxAge: 1000 * 60 * 60 * 24 * 3, // 3일
	buster: 'v1',
});
