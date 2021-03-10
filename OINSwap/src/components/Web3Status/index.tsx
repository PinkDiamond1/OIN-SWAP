// @ts-nocheck
import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { darken, lighten } from 'polished';
import { Activity } from 'react-feather';
import { useWalletModalToggle } from '../../state/application/hooks';
import { TransactionDetails } from '../../state/transactions/reducer';
import { ButtonSecondary } from '../Button';
import { useAccount } from '@/state/user/hooks';

const IconWrapper = styled.div<{ size?: number }>`
	${({ theme }) => theme.flexColumnNoWrap};
	align-items: center;
	justify-content: center;
	& > * {
		height: ${({ size }) => (size ? size + 'px' : '32px')};
		width: ${({ size }) => (size ? size + 'px' : '32px')};
	}
`;

const Web3StatusGeneric = styled(ButtonSecondary)`
	${({ theme }) => theme.flexRowNoWrap}
	width: 100%;
	align-items: center;
	padding: 0.5rem;
	border-radius: 12px;
	cursor: pointer;
	user-select: none;
	:focus {
		outline: none;
	}
`;
const Web3StatusError = styled(Web3StatusGeneric)`
	background-color: ${({ theme }) => theme.red1};
	border: 1px solid ${({ theme }) => theme.red1};
	color: ${({ theme }) => theme.white};
	font-weight: 500;
	:hover,
	:focus {
		background-color: ${({ theme }) => darken(0.1, theme.red1)};
	}
`;

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
	background-color: ${({ theme }) => theme.primary4};
	border: none;
	color: ${({ theme }) => theme.primaryText1};
	font-weight: 500;

	:hover,
	:focus {
		border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
		color: ${({ theme }) => theme.primaryText1};
	}

	${({ faded }) =>
		faded &&
		css`
			background-color: ${({ theme }) => theme.primary5};
			border: 1px solid ${({ theme }) => theme.primary5};
			color: ${({ theme }) => theme.primaryText1};

			:hover,
			:focus {
				border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
				color: ${({ theme }) => darken(0.05, theme.primaryText1)};
			}
		`}
`;

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
	background-color: ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg2)};
	border: 1px solid ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg3)};
	color: ${({ pending, theme }) => (pending ? theme.white : theme.text1)};
	font-weight: 500;
	:hover,
	:focus {
		background-color: ${({ pending, theme }) => (pending ? darken(0.05, theme.primary1) : lighten(0.05, theme.bg2))};

		:focus {
			border: 1px solid ${({ pending, theme }) => (pending ? darken(0.1, theme.primary1) : darken(0.1, theme.bg3))};
		}
	}
`;

const Text = styled.p`
	flex: 1 1 auto;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin: 0 0.5rem 0 0.25rem;
	font-size: 1rem;
	width: fit-content;
	font-weight: 500;
`;

const NetworkIcon = styled(Activity)`
	margin-left: 0.25rem;
	margin-right: 0.5rem;
	width: 16px;
	height: 16px;
`;

// we want the latest one to come first, so return negative if a is after b
function newTranscationsFirst(a: TransactionDetails, b: TransactionDetails) {
	return b.addedTime - a.addedTime;
}

function recentTransactionsOnly(a: TransactionDetails) {
	return new Date().getTime() - a.addedTime < 86_400_000;
}

export default function Web3Status() {
	const { t } = useTranslation();
	const account = useAccount();
	const toggleWalletModal = useWalletModalToggle();

	// handle the logo we want to show with the account
	function getStatusIcon() {
		return (
			<IconWrapper size={16}>
				<img src={require('@/assets/images/iostlogo.png')} alt={''} />
			</IconWrapper>
		);
	}

	function getWeb3Status() {
		if (account)
			return (
				<Web3StatusConnected id="web3-status-connected" onClick={toggleWalletModal} pending={false}>
					<Text>{account}</Text>
					{getStatusIcon()}
				</Web3StatusConnected>
			);

		return (
			<Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account}>
				<Text>{t('Connect to a wallet')}</Text>
			</Web3StatusConnect>
		);
	}

	return getWeb3Status();
}
