import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {persistReducer, persistStore} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import {authReducer, cleanUser} from './slices/auth.slice';
import {cleanWorker, workerReducer} from 'src/stores/slices/worker.slice';
import {cleanFarm} from 'src/stores/slices/auth.slice';
import {cleanHarvest, harvestReducer} from 'src/stores/slices/harvest.slice';
import {cleanQrCode, qrCodeReducer} from 'src/stores/slices/qrCode.slice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
};

const reducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  worker: workerReducer,
  harvest: harvestReducer,
  qrCode: qrCodeReducer,
});

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export const callLogOut = async () => {
  await persistor.purge();
  await persistConfig.storage.clear();
  store.dispatch(cleanUser());
  store.dispatch(cleanFarm());
  store.dispatch(cleanWorker());
  store.dispatch(cleanHarvest());
  store.dispatch(cleanQrCode());

  const keys = await AsyncStorage.getAllKeys();

  await AsyncStorage.multiRemove(keys);
};

/** Infers the `RootState` types from the store itself */
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
