/**
 * Created by buddy on 2020-07-21.
 */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { iWalletInstalled } from '@/utils/iost';
import { updateWalletStatus } from '@/state/wallet/actions';

export const WalletUpdater = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		const isInstalled = iWalletInstalled();
		dispatch(updateWalletStatus(isInstalled ? 1 : 0));

		(async()=>{

		})()

	}, [dispatch]);

	return null;
};
