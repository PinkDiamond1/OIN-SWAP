/**
 * Created by buddy on 2020-07-20.
 */
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from '@/state';
import { updateUserDarkMode } from '@/state/user/actions';
import { useCallback } from 'react';

export const useAccount = () => 'orangeost';

export function useDarkModeManager(): [boolean, () => void] {
	const dispatch = useDispatch<AppDispatch>();
	const darkMode = useIsDarkMode();

	const toggleSetDarkMode = useCallback(() => {
		dispatch(updateUserDarkMode({ userDarkMode: !darkMode }));
	}, [darkMode, dispatch]);

	return [darkMode, toggleSetDarkMode];
}

export function useIsDarkMode(): boolean {
	const { userDarkMode, matchesDarkMode } = useSelector<
		AppState,
		{ userDarkMode: boolean | null; matchesDarkMode: boolean }
	>(
		({ user: { matchesDarkMode, userDarkMode } }) => ({
			userDarkMode,
			matchesDarkMode,
		}),
		shallowEqual
	);

	return userDarkMode === null ? matchesDarkMode : userDarkMode;
}

export const useExpertModeManager = () => [true, () => {}];

export const useTokensBalance = (token: string) => {
	const balacnes =
		useSelector<AppState, AppState['user']['userTokensBalance']>(state => state.user.userTokensBalance) || {};
	return balacnes[token] || '-';
};

export const useUserDeadline = () => [20 * 60, () => {}];

export const useUserSlippageTolerance = () => [0.5, () => {}];
