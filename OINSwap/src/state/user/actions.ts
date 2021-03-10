/**
 * Created by buddy on 2020-07-20.
 */

import { createAction } from '@reduxjs/toolkit';

export interface SerializedToken {
	chainId: number;
	address: string;
	decimals: number;
	symbol?: string;
	name?: string;
}

export interface SerializedPair {
	token0: SerializedToken;
	token1: SerializedToken;
}

export const updateMatchesDarkMode = createAction<{ matchesDarkMode: boolean }>('updateMatchesDarkMode');
export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>('updateUserDarkMode');
export const updateUserExpertMode = createAction<{ userExpertMode: boolean }>('updateUserExpertMode');
export const updateUserSlippageTolerance = createAction<{ userSlippageTolerance: number }>(
	'updateUserSlippageTolerance'
);
export const updateUserDeadline = createAction<{ userDeadline: number }>('updateUserDeadline');

/* iost */
export const updateUserName = createAction<{ userName: string }>('updateUserName');
export const updateUserBalance = createAction<{ token: string; userBalance: string }>('updateUserBalance');

export const updateUserTokensBalance = createAction<Record<string, number | string>>('updateUserTokensBalance');
