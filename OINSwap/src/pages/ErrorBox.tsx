/**
 * Created by buddy on 2020-07-24.
 */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import error from '@/modules/error';
import { X } from 'react-feather';
import { AutoRow } from '@/components/Row';

const Box = styled.div`
	color: ${({ theme }) => theme.main1};
	background: ${({ theme }) => theme.background3};
	font-size: 14px;
	min-height: 2rem;
	border-radius: 1rem;
	cursor: pointer;
	word-break: break-all;
	padding: 20px;
`;

const ErrorText = styled.div`
	//color: red;
`;

export default observer(() => {
	useEffect(() => {
		if (!error.message) {
			return;
		}
		const timer = setTimeout(() => {
			error.setMessage('');
		}, 3000);
		return () => {
			clearTimeout(timer);
		};
	}, []);

	return error.message ? (
		<Box>
			<AutoRow justify={'flex-end'}>
				<X
					onClick={() => {
						error.setMessage('');
					}}
				/>
			</AutoRow>

			<ErrorText>Error: {error.message}</ErrorText>
		</Box>
	) : null;
});
