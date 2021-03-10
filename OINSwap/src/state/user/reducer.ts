/**
 * Created by buddy on 2020-07-20.
 */
// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import {
	updateMatchesDarkMode,
	updateUserDarkMode,
	updateUserDeadline,
	updateUserExpertMode,
	updateUserSlippageTolerance,
	updateUserTokensBalance,
} from '@/state/user/actions';

const currentTimestamp = () => new Date().getTime();

const initialState = {
	userDarkMode: true,
	matchesDarkMode: false,
	timestamp: currentTimestamp(),
	userExpertMode: false,
	userSlippageTolerance: 0,
	userDeadline: 0,
	userTokensBalance: { iost: 0 },
};

/* TODO 其实这里的设置跟用户没关系 */
export default createReducer(initialState, builder =>
	builder
		.addCase(updateUserDarkMode, (state, action) => {
			state.userDarkMode = action.payload.userDarkMode;
			state.timestamp = currentTimestamp();
		})
		.addCase(updateMatchesDarkMode, (state, action) => {
			state.matchesDarkMode = action.payload.matchesDarkMode;
			state.timestamp = currentTimestamp();
		})
		.addCase(updateUserExpertMode, (state, action) => {
			state.userExpertMode = action.payload.userExpertMode;
		})
		.addCase(updateUserSlippageTolerance, (state, action) => {
			state.userSlippageTolerance = action.payload.userSlippageTolerance;
		})
		.addCase(updateUserDeadline, (state, { payload: { userDeadline } }) => {
			state.userDeadline = userDeadline;
		})
		.addCase(updateUserTokensBalance, (state, action) => {
			state.userTokensBalance = { ...(state.userTokensBalance || {}), ...action.payload };
		})
);
