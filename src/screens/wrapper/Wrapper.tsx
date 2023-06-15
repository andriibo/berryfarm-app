import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {AvoidSoftInput} from 'react-native-avoid-softinput';

import AuthStack from 'src/navigation/auth.stack';
import DrawerStack from 'src/navigation/drawer.stack';
import {useIsAuthenticated} from 'src/stores/slices/auth.slice';
import {useLoadedData} from 'src/stores/slices/device.slice';
import {LoadData} from 'src/screens/auth/load-data';

const Wrapper = () => {
  const isAuth = useIsAuthenticated();
  const loadedData = useLoadedData();

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

  if (!loadedData) {
    return <LoadData />;
  }

  if (!isAuth) {
    return <AuthStack />;
  }

  return <DrawerStack />;
};

export {Wrapper};
