import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {AvoidSoftInput} from 'react-native-avoid-softinput';
import AuthStack from 'src/navigation/auth.stack';
import DrawerStack from 'src/navigation/drawer.stack';
import {useIsAuthenticated, useIsLoadedData} from 'src/stores/slices/auth.slice';
import {InternetNotConnected} from 'src/screens/auth/internet-not-connected';
import {useCheckInternetConnection} from 'src/stores/hooks/use-check-internet-connection';
import {useIsInternetConnected} from 'src/stores/slices/connect-device.slice';

const Wrapper = () => {
  const isAuth = useIsAuthenticated();
  const isLoadedData = useIsLoadedData();
  const isInternetConnected = useIsInternetConnected();

  useCheckInternetConnection();

  const onFocusEffect = useCallback(() => {
    // This should be run when screen gains focus - enable the module where it's needed
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
    AvoidSoftInput.setEnabled(true);

    return () => {
      // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
      AvoidSoftInput.setEnabled(false);
      AvoidSoftInput.setShouldMimicIOSBehavior(false);
    };
  }, []);

  useFocusEffect(onFocusEffect); // register callback to focus events

  if (!isInternetConnected && !isLoadedData) {
    return <InternetNotConnected />;
  }

  if (!isAuth) {
    return <AuthStack />;
  }

  return <DrawerStack />;
};

export {Wrapper};
