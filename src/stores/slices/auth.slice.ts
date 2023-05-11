import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {useAppSelector} from 'src/stores/hooks/hooks';
import {RootState} from 'src/stores/store';
import {User} from 'src/stores/types/user.type';
import {Farm} from 'src/stores/types/farm.type';

export type UserInfo = Pick<User, 'username'>;
export type FarmInfo = Pick<
  Farm,
  'apiUrlPrefix' | 'farmName' | 'firestorePrefix'
>;

type IFarm = {
  apiUrlPrefix: string;
  farmName: string;
  firestorePrefix: string;
};

type IUser = {
  id: number;
  username: string;
};

type IAuthState = {
  farm: IFarm;
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
    setFarm: (state: IAuthState, {payload}: PayloadAction<FarmInfo>) => {
      state.farm.apiUrlPrefix = payload.apiUrlPrefix;
      state.farm.farmName = payload.farmName;
      state.farm.firestorePrefix = payload.firestorePrefix;
    },
    setUser: (state: IAuthState, {payload}: PayloadAction<UserInfo>) => {
      state.user.username = payload.username;
    },
    cleanFarm: (state: IAuthState) => {
      state.farm.apiUrlPrefix = '';
      state.farm.farmName = '';
      state.farm.firestorePrefix = '';
    },
    cleanUser: (state: IAuthState) => {
      state.user.id = 0;
      state.user.username = '';
    },
  },
});

export const selectFarm = (state: RootState) => state.auth.farm;
export const selectUser = (state: RootState) => state.auth.user;
export const useFarm = () => useAppSelector(selectFarm);
export const useUser = () => useAppSelector(selectUser);

export const {
  reducer: authReducer,
  actions: {setUser, setFarm},
} = authSlice;
