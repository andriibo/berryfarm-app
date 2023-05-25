import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {AvoidSoftInput} from 'react-native-avoid-softinput';

import AuthStack from 'src/navigation/auth.stack';
import DrawerStack from 'src/navigation/drawer.stack';
import {useIsAuthenticated} from 'src/stores/slices/auth.slice';

const Wrapper = () => {
  const isAuth = useIsAuthenticated();

  const onFocusEffect = React.useCallback(() => {
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

  if (!isAuth) {
    return <AuthStack />;
  }

  return <DrawerStack />;
};

export {Wrapper};
