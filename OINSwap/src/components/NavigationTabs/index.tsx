import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { useTranslation } from 'react-i18next';
import { NavLink, Link as HistoryLink, Link, useHistory, useLocation } from 'react-router-dom';

import { ArrowLeft } from 'react-feather';
import Row, { RowBetween } from '../Row';
import QuestionHelper from '../QuestionHelper';
import { Button, ButtonGroup, IconButton, Menu, MenuItem } from '@material-ui/core';
import { ChevronDown } from 'react-feather';

const Tabs = styled.div`
	${({ theme }) => theme.flexRowNoWrap}
	align-items: center;
	border-radius: 3rem;
	justify-content: space-evenly;
`;

const activeClassName = 'ACTIVE';

const StyledNavLink = styled(NavLink).attrs({
	activeClassName,
})`
	${({ theme }) => theme.flexRowNoWrap}
	align-items: center;
	justify-content: center;
	height: 3rem;
	border-radius: 3rem;
	outline: none;
	cursor: pointer;
	text-decoration: none;
	color: ${({ theme }) => theme.text3};
	font-size: 20px;

	&.${activeClassName} {
		border-radius: 12px;
		font-weight: 500;
		color: ${({ theme }) => theme.text1};
	}

	:hover,
	:focus {
		color: ${({ theme }) => darken(0.1, theme.text1)};
	}
`;

const ActiveText = styled.div`
	font-weight: 500;
	font-size: 20px;
`;

const StyledArrowLeft = styled(ArrowLeft)`
	color: ${({ theme }) => theme.text1};
`;

// export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
// 	const { t } = useTranslation();
// 	return (
// 		<Tabs style={{ marginBottom: '20px' }}>
// 			<StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
// 				{t('swap')}
// 			</StyledNavLink>
// 			<StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
// 				{t('pool')}
// 			</StyledNavLink>
// 		</Tabs>
// 	);
// }

export function CreatePoolTabs() {
	return (
		<Tabs>
			<RowBetween style={{ padding: '1rem' }}>
				<HistoryLink to="/pool">
					<StyledArrowLeft />
				</HistoryLink>
				<ActiveText>Create Pool</ActiveText>
				<QuestionHelper text={'Use this interface to create a new pool.'} />
			</RowBetween>
		</Tabs>
	);
}

export function FindPoolTabs() {
	return (
		<Tabs>
			<RowBetween style={{ padding: '1rem' }}>
				<HistoryLink to="/pool">
					<StyledArrowLeft />
				</HistoryLink>
				<ActiveText>Import Pool</ActiveText>
				<QuestionHelper text={"Use this tool to find pairs that don't automatically appear in the interface."} />
			</RowBetween>
		</Tabs>
	);
}

export function AddRemoveTabs({ adding }: { adding: boolean }) {
	return (
		<Tabs>
			<RowBetween style={{ padding: '1rem' }}>
				<HistoryLink to="/pool">
					<StyledArrowLeft />
				</HistoryLink>
				<ActiveText>{adding ? 'Add' : 'Remove'} Liquidity</ActiveText>
				<QuestionHelper
					text={
						adding
							? 'When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'
							: 'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'
					}
				/>
			</RowBetween>
		</Tabs>
	);
}

const TabBtnGroup = styled(Row)`
	background: ${({ theme }) => theme.background1};
	border-radius: 30px;
	margin-bottom: 20px;
`;

const TabBtn = styled(Button)<any>`
	background-color: ${({ active, theme }) => (active ? theme.background2 : theme.background1)} !important;
	color: ${({ active, theme }) => (active ? theme.main1 : theme.word1)} !important;
	height: 50px;
	border-radius: 25px !important;
`;

// @ts-nocheck
export const SwapPoolTabs = () => {
	const history = useHistory();
	const location = useLocation();

	const is2Ontd = location.pathname === '/2Ontd';
	const isSwap = location.pathname === '/swap';

	return (
		<TabBtnGroup>
			<TabBtn
				active
				fullWidth
				size="large"
				// onClick={() => {
				// 	history.push('/');
				// }}
			>
				change
			</TabBtn>
			{/*<TabBtn*/}
			{/*	active={isSwap}*/}
			{/*	fullWidth*/}
			{/*	size="large"*/}
			{/*	onClick={() => {*/}
			{/*		history.push('/swap');*/}
			{/*	}}*/}
			{/*>*/}
			{/*	Swap*/}
			{/*</TabBtn>*/}
			{/*<TabBtn*/}
			{/*	active={!(is2Ontd || isSwap)}*/}
			{/*	fullWidth*/}
			{/*	size="large"*/}
			{/*	onClick={() => {*/}
			{/*		history.push('/pool');*/}
			{/*	}}*/}
			{/*>*/}
			{/*	Pool*/}
			{/*</TabBtn>*/}
		</TabBtnGroup>
	);
};

/*
	add
	remove
* * */

const TitleLabel = styled.div`
	font-size: 14px;
	color: ${({ theme }) => theme.main1};
`;

const StyledMenu = styled(Menu)<any>`
	.MuiMenu-paper {
		background: ${({ theme }) => theme.background2};
	}
`;

const StyledMenuItem = styled(MenuItem)<any>`
	color: ${({ theme, active }) => (active ? theme.main1 : theme.word3)} !important;
`;

const StyledChevronDown = styled(ChevronDown)<any>`
	color: ${({ theme }) => theme.word3};
`;

export const PoolBar = ({ active = false }: any) => {
	const history = useHistory();

	const options = [
		{
			text: 'Add Liquidity',
			path: '/pool',
		},
		{ text: 'Remove Liquidity', path: '/delpool' },
	];

	const activeName = options[active ? 0 : 1].text;

	const activeIndex = options.findIndex(x => x.text === activeName);

	const handleClick = useCallback(
		i => {
			history.push(options[i].path);
		},
		[history, options]
	);

	const [open, setOpen] = useState<any>(false);

	return (
		<RowBetween>
			<TitleLabel>{activeName}</TitleLabel>
			<div style={{ position: 'relative' }}>
				<div
					onClick={(e: any) => {
						setOpen(e.currentTarget);
					}}
				>
					<IconButton size="small">
						<StyledChevronDown />
					</IconButton>
				</div>
				<StyledMenu
					id="simple-menu"
					keepMounted
					anchorEl={open}
					open={Boolean(open)}
					onClose={() => {
						setOpen(null);
					}}
					transformOrigin={{
						horizontal: 'left',
						vertical: 'top',
					}}
				>
					{options.map((item, i) => (
						<StyledMenuItem
							onClick={() => {
								handleClick(i);
							}}
							active={i === activeIndex}
							key={i}
						>
							{item.text}
						</StyledMenuItem>
					))}
				</StyledMenu>
			</div>
		</RowBetween>
	);
};
