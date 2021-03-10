/**
 * Created by buddy on 2020-07-25.
 */
import { usePolling } from '@/hooks/usePool';
import { useCallback } from 'react';
import wallet from '@/modules/wallet';

export default () => {
	usePolling(
		useCallback(() => wallet.askWalletStatus(), []),
		300
	);

	usePolling(
		useCallback(() => wallet.askNetwork(), []),
		300
	);
	return null;
};
