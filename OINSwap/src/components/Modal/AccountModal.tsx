/**
 * Created by buddy on 2020-08-13.
 */
import Modal from 'react-responsive-modal';
import { ModalView } from '@/components/Modal/component';
import React from 'react';
import styled from 'styled-components';
import { CheckCircle, Copy, ExternalLink } from 'react-feather';
import user from '@/modules/user';
import { AutoRow } from '@/components/Row';
import { AutoColumn } from '@/components/Column';
import useCopyClipboard from '@/hooks/useCopyClipboard';
import { observer } from 'mobx-react';
import wallet from '@/modules/wallet';

const InfoWrapper = styled.div`
	border: 1px solid ${({ theme }) => theme.bg5};
	border-radius: 10px;
	padding: 1rem;
`;

const AddressText = styled.div`
	font-size: 18px;
	font-weight: 500;
	margin: 1rem 0;
`;

const ClickItem = styled.div<{ disabled?: boolean }>`
	display: flex;
	cursor: pointer;
	font-size: 14px;
	color: ${({ disabled }) => (disabled ? '#fff' : 'gray')};
	:hover {
		color: #fff;
		a {
			color: #fff;
		}
	}
`;

const MarginWrapper = styled.div`
	margin-right: 4px;
`;

const Link = styled.a`
	display: flex;
	cursor: pointer;
	font-size: 14px;
	color: gray;
	:focus {
		outline: none;
	}
`;

export default observer(({ open, setOpen }) => {
	const close = () => {
		setOpen(false);
	};

	const [isCopied, copy] = useCopyClipboard();

	return (
		<Modal open={open} onClose={close} showCloseIcon={false} center>
			<ModalView title="Account" onClose={close}>
				<InfoWrapper>
					<AutoColumn gap="md">
						<AddressText>{user.address}</AddressText>
						<AutoRow gap="8px">
							{isCopied ? (
								<ClickItem disabled>
									<MarginWrapper>
										<CheckCircle size={14} />
									</MarginWrapper>
									<div>Copied</div>
								</ClickItem>
							) : (
								<ClickItem
									onClick={() => {
										copy(user.address);
									}}
								>
									<MarginWrapper>
										<Copy size={14} />
									</MarginWrapper>
									<div>Copy Address</div>
								</ClickItem>
							)}
							<ClickItem>
								<MarginWrapper>
									<ExternalLink size={14} />
								</MarginWrapper>

								<Link
									href={`https://explorer.ont.io/address/${user.address}/ALL/10/1/${wallet.isTest ? 'testnet' : ''}`}
									target="_blank"
								>
									View on ontExplorer
								</Link>
							</ClickItem>
						</AutoRow>
					</AutoColumn>
				</InfoWrapper>
				{/*<div>Your transactions will appear here...</div>*/}
			</ModalView>
		</Modal>
	);
});
