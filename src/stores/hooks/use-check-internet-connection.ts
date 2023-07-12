import NetInfo from '@react-native-community/netinfo';
import {useEffect} from 'react';
import {setIsInternetConnection} from 'src/stores/slices/connect-device.slice';

import {useAppDispatch} from './hooks';

export const useCheckInternetConnection = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.type === 'wifi') {
        if (state.isInternetReachable === false) {
          dispatch(setIsInternetConnection(state.isInternetReachable));
        } else {
          dispatch(setIsInternetConnection(state.isConnected));
        }
      } else {
        dispatch(setIsInternetConnection(!!state.isConnected));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
};
