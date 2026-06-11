import React, { lazy, Suspense } from 'react';

export default function dynamic(factory, options = {}) {
	// Next.js dynamic({ ssr: false }) 옵션은 무시하고
	// React.lazy + Suspense 로만 처리
	const Component = lazy(factory);
	
	return (props) => (
		<Suspense fallback={options?.loading || null}>
			<Component {...props} />
		</Suspense>
	);
}
