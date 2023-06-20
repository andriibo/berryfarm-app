import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {useAppSelector} from 'src/stores/hooks/hooks';
import {RootState} from 'src/stores/store';
import {User} from 'src/stores/types/user.type';
import {Farm} from 'src/stores/types/farm.type';

type IDevice = {
  loadedData: boolean;
};

type IAuthState = {
  user: User;
  farm: Farm;
  device: IDevice;
};

const initialState: IAuthState | any = {
  user: {
    id: 0,
    username: '',
  },
  farm: {
    apiUrlPrefix: '',
    farmName: '',
    firestorePrefix: '',
  },
  device: {
    loadedData: false,
  },
};

const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setUser: (state: IAuthState, {payload}: PayloadAction<User>) => {
      state.user.id = payload.id;
      state.user.username = payload.username;
    },
    cleanUser: (state: IAuthState) => {
      state.user.id = 0;
      state.user.username = '';
    },
    setFarm: (state: IAuthState, {payload}: PayloadAction<Farm>) => {
      state.farm.apiUrlPrefix = payload.apiUrlPrefix;
      state.farm.farmName = payload.farmName;
      state.farm.firestorePrefix = payload.firestorePrefix;
    },
    cleanFarm: (state: IAuthState) => {
      state.farm.apiUrlPrefix = '';
      state.farm.farmName = '';
      state.farm.firestorePrefix = '';
    },
    setLoadedData: (state: IAuthState, {payload}: PayloadAction<boolean>) => {
      state.device.loadedData = payload;
    },
  },
});

export const selectIsAuthenticated = (state: RootState) => !!state.auth.user.username;
export const selectUser = (state: RootState) => state.auth.user;
export const useIsAuthenticated = () => useAppSelector(selectIsAuthenticated);
export const useUser = () => useAppSelector(selectUser);
export const selectFarm = (state: RootState) => state.auth.farm;
export const useFarm = () => useAppSelector(selectFarm);
export const selectDevice = (state: RootState) => state.auth.device;
export const selectIsLoadedData = (state: RootState) => state.auth.device.loadedData;
export const useIsLoadedData = () => useAppSelector(selectIsLoadedData);
export const useDevice = () => useAppSelector(selectDevice);

export const {
  reducer: authReducer,
  actions: {setUser, cleanUser, setFarm, cleanFarm, setLoadedData},
} = authSlice;
