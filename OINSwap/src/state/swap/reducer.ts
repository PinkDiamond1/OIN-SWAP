/**
 * Created by buddy on 2020-07-20.
 */
// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import { updateTokenInput, updateTokenOutput } from '@/state/swap/actions';
import wallet from '@/modules/wallet';

const initialState = {
	tokenInput: { ...wallet.nativeToken },
	tokenOutput: null,
};

export default createReducer(initialState, builder =>
	builder
		.addCase(updateTokenInput, (state, action) => {
			state.tokenInput = { ...state.tokenInput, ...action.payload };
		})
		.addCase(updateTokenOutput, (state, action) => {
			state.tokenOupt = { ...state.tokenOutput, ...action.payload };
		})
);
