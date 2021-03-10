/**
 * Created by buddy on 2020-08-13.
 */

import React, { useState } from 'react';
import Logo from '@/assets/images/oinswap.svg';
import { RowBetween } from '@/components/Row';
import { observer } from 'mobx-react';
import wallet from '@/modules/wallet';
import user from '@/modules/user';
import { NATIVE_TOKEN } from '@/constants';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { lighten } from 'polished';
import { CursorPointer } from '@/theme';
import WalletModal from '@/components/Modal/WalletModal';
import AccountModal from '@/components/Modal/AccountModal';
import { isNull } from '@/utils';

const StyledButton = styled(Button).attrs(() => ({
	variant: 'outlined',
}))`
	padding: 0.5rem;
	&& {
		border-radius: 10px;
		line-height: 1.5;
		font-size: 1rem;
		font-weight: 500;
		text-transform: none;
		border: 1px solid ${({ theme }) => theme.main1};
		color: ${({ theme }) => theme.main1};
	}
	:hover {
		border-color: ${({ theme }) => lighten(0.2, theme.main1)};
	}
`;

const AddressWrapper = styled.div`
	display: flex;
	align-items: center;
	font-weight: 500;
	background: ${({ theme }) => theme.bg3};
	border-radius: 10px;
	overflow: hidden;
	padding: 2px;
`;

const Text = styled.div`
	padding: 0.5rem;
	line-height: 1.5;
	color: #fff;
	border-radius: 10px;
`;

const AddressText = styled(Text)`
	background: ${({ theme }) => theme.background2};
	:hover {
		background: ${({ theme }) => lighten(0.1, theme.background2)};
	}
`;

const WalletStatus = observer(() => {
	const [walletOpen, setWalletOpen] = useState(false);
	const [accountOpen, setAccountOpen] = useState(false);

	if (!wallet.isLogin) {
		return (
			<>
				<StyledButton
					onClick={() => {
						setWalletOpen(true);
					}}
				>
					Connect wallet
				</StyledButton>
				<WalletModal open={walletOpen} setOpen={setWalletOpen} />
			</>
		);
	}

	const balance = user.balance[NATIVE_TOKEN];

	return (
		<AddressWrapper>
			{!isNull(balance) && (
				<Text>
					{balance} {NATIVE_TOKEN}
				</Text>
			)}
			<CursorPointer>
				<>
					<AddressText
						onClick={() => {
							setAccountOpen(true);
						}}
					>
						{user.ellipsisAddress}
					</AddressText>
					<AccountModal open={accountOpen} setOpen={setAccountOpen} />
				</>
			</CursorPointer>
		</AddressWrapper>
	);
});

const MyComponent = () => {
	return (
		<RowBetween>
			<img src={Logo} alt="" style={{ width: '172px' }} />
			<WalletStatus />
		</RowBetween>
	);
};

export default MyComponent;
