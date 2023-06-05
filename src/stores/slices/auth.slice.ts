import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {useAppSelector} from 'src/stores/hooks/hooks';
import {RootState} from 'src/stores/store';
import {User} from 'src/stores/types/user.type';

export type UserInfo = Pick<User, 'username'>;

type IUser = {
  id: number;
  username: string;
};

type IAuthState = {
  user: IUser;
};

const initialState: IAuthState | any = {
  farm: {
    apiUrlPrefix: '',
    farmName: '',
    firestorePrefix: '',
  },
  user: {
    id: 0,
    username: '',
  },
};

const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setUser: (state: IAuthState, {payload}: PayloadAction<UserInfo>) => {
      state.user.username = payload.username;
    },
    cleanUser: (state: IAuthState) => {
      state.user.id = 0;
      state.user.username = '';
    },
  },
});

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.user.username !== '';
export const selectUser = (state: RootState) => state.auth.user;
export const useIsAuthenticated = () => useAppSelector(selectIsAuthenticated);
export const useUser = () => useAppSelector(selectUser);

export const {
  reducer: authReducer,
  actions: {setUser, cleanUser},
} = authSlice;
