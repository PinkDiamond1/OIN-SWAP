/**
 * Created by buddy on 2020-08-11.
 */
import styled, { keyframes } from 'styled-components';
import { ChevronsDown, Loader } from 'react-feather';

export const StyledChevronsDown = styled(ChevronsDown)<{ active?: boolean }>`
	color: ${({ theme, active }) => (active ? theme.main1 : theme.word3)};
	cursor: pointer;
`;

const rotate = keyframes`
	from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const LoadingIcon = styled(Loader)`
	animation: 2s ${rotate} linear infinite;
`;
