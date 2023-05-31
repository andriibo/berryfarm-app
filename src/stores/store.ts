import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {persistReducer, persistStore} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import {authReducer, cleanUser} from './slices/auth.slice';
import {connectDeviceReducer} from 'src/stores/slices/connect-device.slice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
};

const reducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  connectDevice: connectDeviceReducer,
});

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export const callLogOut = async () => {
  await persistor.purge();
  await persistConfig.storage.clear();
  store.dispatch(cleanUser());
};

/** Infers the `RootState` types from the store itself */
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
