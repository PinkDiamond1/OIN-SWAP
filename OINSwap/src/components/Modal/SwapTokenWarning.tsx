/**
 * Created by buddy on 2020-08-19.
 */
import Modal from 'react-responsive-modal';
import React from 'react';
import { ModalContainer } from '@/components/Modal/component';
import Column, { AutoColumn } from '@/components/Column';
import { Avatar, Button } from '@material-ui/core';
import { AlertOctagon } from 'react-feather';
import styled from 'styled-components';
import { darken, lighten } from 'polished';
import Row, { AutoRow } from '@/components/Row';
import wallet from '@/modules/wallet';

/*
	Alert
	Dialog
	Modal
* * */

const StyledModalContainer = styled(ModalContainer)`
	min-width: 300px;
	padding: 3rem 4rem;
	color: ${({ theme }) => darken(0.1, theme.red1)};
	border: 1px solid ${({ theme }) => theme.red1};
`;

const Typograhpy = styled.p`
	line-height: 1.2;
	margin: 0;
`;

const Link = styled.div`
	font-size: 12px;
	color: ${({ theme }) => theme.word3};
`;

const TokenBar = styled(Row)`
	background: ${({ theme }) => theme.bg2};
	padding: 10px;
	border-radius: 12px;
	color: #fff;
	:hover {
		cursor: pointer;
		${Link} {
			text-decoration: underline;
		}
	}
`;

const StyledAvatar = styled(Avatar)`
	margin-right: 20px;
`;

const StyledButton = styled(Button)`
	width: fit-content;
	&& {
		margin: 0 auto;
		color: #fff;
		background: ${({ theme }) => darken(0.1, theme.red1)};
	}
	:hover {
		&& {
			background: ${({ theme }) => theme.red1};
		}
	}
`;

export default ({ open, onClose, coin }) => {
	return (
		<Modal open={open} onClose={() => {}} showCloseIcon={false} center>
			<StyledModalContainer>
				<AutoColumn gap="lg">
					<div>
						<AlertOctagon /> Token imported
					</div>
					<Typograhpy>
						Anyone can create and name any OEP4 token on Ontology, including creating fake versions of existing tokens
						and tokens that claim to represent projects that do not have a token.
					</Typograhpy>
					<Typograhpy>
						Similar to Ontology, this site can load arbitrary tokens via token addresses. Please do your own research
						before interacting with any OEP4 token.
					</Typograhpy>
					<TokenBar
						onClick={() => {
							window.open(wallet.getCoinAddress(coin));
						}}
					>
						<StyledAvatar src={coin.logo} />
						<Column>
							<div>
								{coin.symbol} ({coin.name})
							</div>
							<Link>(View on OntExplorer)</Link>
						</Column>
					</TokenBar>
					<StyledButton variant="contained" onClick={onClose}>
						I understand
					</StyledButton>
				</AutoColumn>
			</StyledModalContainer>
		</Modal>
	);
};
