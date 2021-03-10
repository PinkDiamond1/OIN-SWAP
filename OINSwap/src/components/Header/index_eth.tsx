// @ts-nocheck
/**
 * Created by buddy on 2020-07-20.
 */
import React from 'react';
import { isMobile } from 'react-device-detect';
import { Text } from 'rebass';

import styled from 'styled-components';

import Logo from '../../assets/svg/logo.svg';
import LogoDark from '../../assets/svg/logo_white.svg';
import Wordmark from '../../assets/svg/wordmark.svg';
import WordmarkDark from '../../assets/svg/wordmark_white.svg';
import { useAccount, useDarkModeManager, useTokensBalance } from '../../state/user/hooks';

import { YellowCard } from '../Card';
import Settings from '../Settings';
import Menu from '../Menu';

import Row, { RowBetween } from '../Row';
import { useSelector } from 'react-redux';
import { IOST } from '@/constants';
import Web3Status from '@/components/Web3Status';

const HeaderFrame = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
	width: 100%;
	top: 0;
	position: absolute;
	z-index: 2;
	${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
`;

const HeaderElement = styled.div`
	display: flex;
	align-items: center;
`;

const HeaderElementWrap = styled.div`
	display: flex;
	align-items: center;

	${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};
`;

const Title = styled.a`
	display: flex;
	align-items: center;
	pointer-events: auto;

	:hover {
		cursor: pointer;
	}
`;

const TitleText = styled(Row)`
	width: fit-content;
	white-space: nowrap;
	${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

const AccountElement = styled.div<{ active: boolean }>`
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
	border-radius: 12px;
	white-space: nowrap;
	width: 100%;

	:focus {
		border: 1px solid blue;
	}
`;

const TestnetWrapper = styled.div`
	white-space: nowrap;
	width: fit-content;
	margin-left: 10px;
	pointer-events: auto;
`;

const NetworkCard = styled(YellowCard)`
	width: fit-content;
	margin-right: 10px;
	border-radius: 12px;
	padding: 8px 12px;
`;

const UniIcon = styled.div`
	transition: transform 0.3s ease;
	:hover {
		transform: rotate(-5deg);
	}
	${({ theme }) => theme.mediaWidth.upToSmall`
    img { 
      width: 4.5rem;
    }
  `};
`;

const HeaderControls = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;

	${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`;

const BalanceText = styled(Text)`
	${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

export default function Header() {
	const account = useAccount();
	const userIostBalance = useTokensBalance(IOST);

	const [isDark] = useDarkModeManager();

	return (
		<HeaderFrame>
			<RowBetween style={{ alignItems: 'flex-start' }} padding="1rem 1rem 0 1rem">
				<HeaderElement>
					<Title href=".">
						<UniIcon>
							<img src={isDark ? LogoDark : Logo} alt="logo" />
						</UniIcon>
						<TitleText>
							<img style={{ marginLeft: '4px', marginTop: '4px' }} src={isDark ? WordmarkDark : Wordmark} alt="logo" />
						</TitleText>
					</Title>
				</HeaderElement>
				<HeaderControls>
					<HeaderElement>
						<TestnetWrapper>{!isMobile && 'MAINNET' && <NetworkCard>MAINNET</NetworkCard>}</TestnetWrapper>
						<AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
							{account && (
								<BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
									{(+userIostBalance).toFixed(4)} IOST
								</BalanceText>
							)}
							<Web3Status />
						</AccountElement>
					</HeaderElement>
					<HeaderElementWrap>
						{/*<VersionSwitch />*/}
						<Settings />
						{/*<Menu />*/}
					</HeaderElementWrap>
				</HeaderControls>
			</RowBetween>
		</HeaderFrame>
	);
}
