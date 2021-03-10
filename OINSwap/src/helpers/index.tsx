/**
 * Created by buddy on 2020-07-21.
 */

import React from 'react';
import { SubmitButton } from '@/components/common';
import { observer } from 'mobx-react';
import wallet from '@/modules/wallet';
import { WALLET_STATUS_TEXT } from '@/constants';

export const WrapperWallet = observer(({ children }) => {
	if (!wallet.isInstalled) {
		return (
			<SubmitButton
				variant="contained"
				fullWidth
				size="large"
				onClick={() => {
					window.open('https://chrome.google.com/webstore/detail/iwallet/kncchdigobghenbbaddojjnnaogfppfj', '_blank');
				}}
			>
				Download iWallet from Extension
			</SubmitButton>
		);
	}
	if (wallet.isLocked || !wallet.isLogin) {
		return (
			<SubmitButton variant="contained" fullWidth size="large" disabled>
				{WALLET_STATUS_TEXT[wallet.status]}
			</SubmitButton>
		);
	}
	return children;
});
