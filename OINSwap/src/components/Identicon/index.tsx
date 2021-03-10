import React, { useEffect, useRef } from 'react';

import styled from 'styled-components';

// @ts-ignore
import Jazzicon from 'jazzicon';
import { useAccount } from '@/state/user/hooks';

const StyledIdenticon = styled.div`
	height: 1rem;
	width: 1rem;
	border-radius: 1.125rem;
	background-color: ${({ theme }) => theme.bg4};
`;

export default function Identicon() {
	const ref = useRef<any>();

	const account = useAccount();

	useEffect(() => {
		if (account && ref.current) {
			ref.current.innerHTML = '';
			ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)));
		}
	}, [account]);

	return <StyledIdenticon ref={ref} />;
}
