import styled from 'styled-components';
import { X } from 'react-feather';
import { RowBetween } from '@/components/Row';
import { CursorPointer } from '@/theme';
import React from 'react';

/**
 * Created by buddy on 2020-08-13.
 */

export const ModalContainer = styled.div`
	min-width: 500px;
	width: 80%;
	border-radius: 10px;
	background: ${({ theme }) => theme.background2};
	margin: 0 auto;
	overflow: hidden;
`;
const ModalBar = styled.div`
	padding: 1rem;
	font-weight: 500;
	background: ${({ theme }) => theme.bg3};
`;

const ModalContent = styled.div`
	padding: 2rem;
	background: ${({ theme }) => theme.background2};
`;

const StyledX = styled(X)`
	:hover {
		color: #afafaf;
	}
`;

export const StyledLink = styled.a`
	color: ${({ theme }) => theme.main1};
`;

export const ModalView = ({ children, title, onClose, ...props }) => {
	return (
		<ModalContainer {...props}>
			<ModalBar>
				<RowBetween>
					{title}
					<CursorPointer>
						<StyledX onClick={onClose} />
					</CursorPointer>
				</RowBetween>
			</ModalBar>
			<ModalContent>{children}</ModalContent>
		</ModalContainer>
	);
};
