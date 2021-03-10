/**
 * Created by buddy on 2020-07-21.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, List, ListItem } from '@material-ui/core';
import styled from 'styled-components';
import Row, { RowBetween } from '@/components/Row';
import { observer } from 'mobx-react';
import user from '@/modules/user';
import { ModalView } from '@/components/Modal/component';
import Modal from 'react-responsive-modal';
import { crateCancelToken, isNull } from '@/utils';
import { getTokenInfo } from '@/wallet';
import tokensModule from '@/modules/tokens';
import Column from '@/components/Column';

const StyledList = styled(List)<any>`
	height: 400px;
	overflow: auto;
	background: ${({ theme }) => theme.background2};
	&.MuiList-padding {
		padding: 0;
		margin-top: 8px;
		margin-bottom: 8px;
	}
`;

const StyledAvatar = styled(Avatar)`
	width: 30px !important;
	height: 30px !important;
	margin-right: 10px;
	img {
		object-fit: fill;
	}
`;

const TokenName = styled.div`
	font-size: 18px;
`;

const FoundText = styled.div`
	color: #afafaf;
	font-size: 14px;
`;

const Link = styled.span`
	color: ${({ theme }) => theme.main1};
	:hover {
		cursor: pointer;
		text-decoration: underline;
	}
`;

const TokenItem = observer(({ token }) => {
	const isIn = tokensModule.isInAdds(token);

	const { name, logo } = token;

	return (
		<Row>
			<StyledAvatar alt={name} src={logo} />
			<Column>
				<TokenName>{name}</TokenName>
				{token.isOut && (
					<FoundText>
						{isIn ? 'Added' : 'Found'} by address{' '}
						<Link
							onClick={e => {
								e.stopPropagation();
								tokensModule[isIn ? 'delCoin' : 'addCoin'](token);
							}}
							onMouseDown={e => e.stopPropagation()}
							onMouseUp={e => e.stopPropagation()}
						>
							({isIn ? 'Remove' : 'Add'})
						</Link>
					</FoundText>
				)}
			</Column>
		</Row>
	);
});

const BalanceText = observer(({ token, needBalance = true }) => {
	useEffect(() => {
		user.askTokenBalance(token);
	}, [needBalance, token]);

	if (!needBalance) {
		return <div>-</div>;
	}

	return <div>{token ? (isNull(user.balance[token.name]) ? '-' : user.balance[token.name]) : '-'}</div>;
});

const StyledListItem = styled(ListItem)<any>`
	opacity: ${({ select }) => (select ? 0.6 : 1)};
	&:hover {
		background: ${({ theme, select }) => (select ? undefined : theme.background1)};
		cursor: ${({ select }) => (select ? undefined : 'pointer')};
	}
`;

const SearchInput = styled.input`
	width: 100%;
	font-size: 18px;
	padding: 1rem;
	outline: none;
	border-radius: 10px;
	border: 1px solid ${({ theme }) => theme.word4};
	background: transparent;
	color: #fff;
	:focus {
		border-color: ${({ theme }) => theme.main1};
	}
`;

const TokenModalView = ({ onSelected, open, onClose, tokens = [], modalBalance = true }) => {
	const [t, setT] = useState(tokens);
	const [key, setKey] = useState('');

	React.useEffect(() => {
		let cancel;
		(async () => {
			let ts;
			try {
				ts = tokens.filter(x => new RegExp(key, 'i').test(x.name));
			} catch (e) {
				ts = [];
			}

			setT(ts);
			if (key.length === 40) {
				try {
					let token = tokens.find(x => x.hash === key);
					if (!token) {
						cancel = crateCancelToken();
						token = await getTokenInfo(key, cancel.token);
					}
					setT([token]);
				} catch (e) {
					/* error */
				}
			}
		})();
		return () => {
			cancel && cancel.cancel('remove');
		};
	}, [key, tokens]);

	const onSearch = useCallback(value => {
		setKey(value);
	}, []);

	return (
		<Modal open={open} onClose={onClose} showCloseIcon={false} center>
			<ModalView onClose={onClose} title="Select a Token">
				<SearchInput
					placeholder="Search name or paste aaddress (OEP-4)"
					onInput={(e: any) => {
						onSearch(e.target.value);
					}}
					onKeyUp={(e: any) => {
						if (e.keyCode == 13 && t.length > 0) {
							onSelected(t[0]);
							onClose();
						}
					}}
				/>
				<StyledList>
					{t.map((token, i) => (
						<StyledListItem
							key={token.name}
							onClick={() => {
								if (token.isSelected) {
									return;
								}

								onSelected(token);
								onClose();
							}}
							select={token.isSelected}
						>
							<RowBetween>
								<TokenItem token={token} />
								<BalanceText token={token} needBalance={modalBalance} />
							</RowBetween>
						</StyledListItem>
					))}
				</StyledList>
			</ModalView>
		</Modal>
	);
};

export default props => props.open && <TokenModalView {...props} />;
