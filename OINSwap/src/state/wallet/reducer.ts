/**
 * Created by buddy on 2020-07-21.
 */

/* TODO 操作 | 执行 */

import { createReducer } from '@reduxjs/toolkit';
import { updateWalletStatus } from '@/state/wallet/actions';

export const initialState = {
	/*
	0 - uninstalled
	1 - installed
* * */
	walletStatus: 0,
};

export default createReducer(initialState, builder =>
	builder.addCase(updateWalletStatus, (state, { payload: walletState }) => {
		// @ts-ignore
		state.walletStatus = walletState;
	})
);
