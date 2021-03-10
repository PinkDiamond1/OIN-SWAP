import styled from 'styled-components';
import { Avatar } from '@material-ui/core';
import Row from '@/components/Row';
import React, { useCallback, useState } from 'react';
import { ChevronDown } from 'react-feather';
import TokenModal from '../TokenModal';

/**
 * Created by buddy on 2020-07-21.
 */
const StyledAvatar = styled(Avatar)`
	width: 20px !important;
	height: 20px !important;
	margin-right: 10px;
	img {
		object-fit: fill;
	}
`;

const BtnWrapper = styled.button<any>`
	-webkit-appearance: button;
	-webkit-writing-mode: horizontal-tb !important;
	text-rendering: auto;
	letter-spacing: normal;
	word-spacing: normal;
	text-shadow: none;
	display: inline-block;
	text-align: center;
	box-sizing: border-box;
	padding: 1px 7px 2px;

	-webkit-box-align: center;
	align-items: center;
	font-size: 1rem;
	color: ${({ theme, isSelected }) => (isSelected ? theme.word3 : theme.main1)};
	border-color: ${({ theme, isSelected }) => (isSelected ? theme.word4 : theme.main1)};
	height: 2rem;
	background-color: rgb(33, 37, 41);
	cursor: pointer;
	user-select: none;
	border-width: 1px;
	border-style: solid;
	border-image: initial;
	border-radius: 2.5rem;
	outline: none;
	&:hover {
		opacity: 0.9;
	}
	&:focus {
		border-color: ${({ theme }) => theme.main1};
	}
`;

const TokenItem = ({ name, logo }: any) => (
	<Row>
		<StyledAvatar alt={name} src={logo} />
		<div>{name.toUpperCase()}</div>
	</Row>
);

const TokenBtn = ({ token, onSelected: _onSelected, modal = true, tokens, modalBalance, ...props }: any) => {
	const isSelected = !!token;

	const [open, setOpen] = useState(false);

	const onSelected = selectToken => {
		_onSelected(selectToken);
	};

	const onClose = useCallback(() => {
		setOpen(false);
	}, []);

	return (
		<>
			<BtnWrapper
				{...props}
				isSelected={isSelected}
				onClick={() => {
					if (!modal) {
						return;
					}
					setOpen(true);
				}}
			>
				<Row>
					{isSelected ? <TokenItem {...token} /> : 'Select a token'}
					<ChevronDown size={18} />
				</Row>
			</BtnWrapper>
			<TokenModal open={open} onSelected={onSelected} onClose={onClose} tokens={tokens} modalBalance={modalBalance} />
		</>
	);
};

export default TokenBtn;
