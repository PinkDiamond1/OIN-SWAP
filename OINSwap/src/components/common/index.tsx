/**
 * Created by buddy on 2020-07-21.
 */
import React from 'react';
import { AutoColumn } from '@/components/Column';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { observer } from 'mobx-react';
import wallet from '@/modules/wallet';
import { WALLET_STATUS_TEXT } from '@/constants';
import { LoadingIcon } from '@/components/Icon';

export const WorkWrapper = styled(AutoColumn)`
	padding: 20px;
	background: ${({ theme }) => theme.background1};
	border-radius: 10px;
`;

export const StyleButtons = styled(Button).attrs(() => ({
	variant: 'contained',
	fullWidth: true,
	size: 'large',
}))`
	margin-top: 40px !important;
	max-width: 20rem;
	height: 50px !important;
	border-radius: 25px !important;
	background-color: ${({ theme }) => theme.main1} !important;
	text-transform: unset !important;
	&.Mui-disabled {
		background-color: rgba(0, 0, 0, 0.12) !important;
		color: gray !important;
	}
	&.MuiButton-contained {
		color: #fff;
	}
`;

export const SubmitButton = observer(props => {
	if (!wallet.isInstalled) {
		return (
			<StyleButtons
				onClick={() => {
					window.open(process.env.REACT_APP_WALLET_DOWNLOAD, '_blank');
				}}
			>
				Download {process.env.REACT_APP_WALLET_NAME}
			</StyleButtons>
		);
	}
	if (wallet.isLocked || !wallet.isLogin) {
		return (
			<StyleButtons variant="contained" fullWidth size="large" disabled>
				{WALLET_STATUS_TEXT[wallet.status]}
			</StyleButtons>
		);
	}

	const { children, disabled, loading } = props;

	return (
		<StyleButtons {...props} disabled={loading || disabled}>
			{loading ? <LoadingIcon /> : children}
		</StyleButtons>
	);
});
