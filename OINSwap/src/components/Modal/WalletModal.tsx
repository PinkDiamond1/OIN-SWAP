/**
 * Created by buddy on 2020-08-13.
 */

import React from 'react';
import Modal from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import styled from 'styled-components';
import { RowBetween } from '@/components/Row';
import { CursorPointer } from '@/theme';
import { Avatar } from '@material-ui/core';
import * as iWallet from '@/wallet';
import { ModalView, StyledLink } from '@/components/Modal/component';

const WalletWrapper = styled.div`
	border: 1px solid ${({ theme }) => theme.bg5};
	border-radius: 10px;
	padding: 0.5rem;
	margin-bottom: 10px;
	font-weight: 500;
	font-size: 18px;

	:hover {
		border-color: ${({ theme }) => theme.main1};
	}
`;

const WalletItem = ({ onClick = () => {}, name = 'Cyano Wallet', icon = require('@/assets/icon/ont.png') }) => {
	return (
		<WalletWrapper onClick={onClick}>
			<CursorPointer>
				<RowBetween>
					<div>{name}</div>
					<Avatar src={icon} />
				</RowBetween>
			</CursorPointer>
		</WalletWrapper>
	);
};

const WalletTip = styled.div`
	margin-top: 2rem;
`;

export default ({ open, setOpen }) => {
	const close = () => {
		setOpen(false);
	};

	return (
		<Modal open={open} onClose={close} showCloseIcon={false} center>
			<ModalView title="Connect to a Wallet" onClose={close}>
				<WalletItem onClick={() => iWallet.login()} />
				<WalletTip>
					New to Ontology ?&nbsp;&nbsp;
					<StyledLink href={process.env.REACT_APP_WALLET_DOWNLOAD} target={'_blank'}>
						Get the Cyano Wallet
					</StyledLink>
				</WalletTip>
			</ModalView>
		</Modal>
	);
};
