import React, {useEffect} from 'react';
import {AvoidSoftInput} from 'react-native-avoid-softinput';

import AuthStack from 'src/navigation/auth.stack';
import DrawerStack from 'src/navigation/drawer.stack';
import {useIsAuthenticated} from 'src/stores/slices/auth.slice';

const Wrapper = () => {
  const isAuth = useIsAuthenticated();

  useEffect(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
  }, []);

  if (!isAuth) {
    return <AuthStack />;
  }

  return <DrawerStack />;
};

export {Wrapper};
