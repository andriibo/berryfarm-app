import NetInfo from '@react-native-community/netinfo';
import {useEffect} from 'react';
import {setIsInternetConnection} from 'src/stores/slices/connect-device.slice';
import {useAppDispatch} from './hooks';
import {NetInfoStateType} from '@react-native-community/netinfo/src/internal/types';

export const useCheckInternetConnection = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.type === NetInfoStateType.wifi) {
        dispatch(setIsInternetConnection(!!state.isInternetReachable));
      } else {
        dispatch(setIsInternetConnection(!!state.isConnected));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
};
