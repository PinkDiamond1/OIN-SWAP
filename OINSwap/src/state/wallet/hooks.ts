/**
 * Created by buddy on 2020-07-21.
 */
import { useSelector } from 'react-redux';
import { AppState } from '@/state';

export const useWalletInstalled = () => {
	const status = useSelector<AppState, AppState['wallet']['walletStatus']>(state => state.wallet.walletStatus);
	return status === 1;
};
