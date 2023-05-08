import React, {useEffect} from 'react';
import {AvoidSoftInput} from 'react-native-avoid-softinput';

import {Loader} from 'src/components/loader';
import AuthStack from 'src/navigation/auth.stack';

const Wrapper = () => {
  const isAuth = false;

  useEffect(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
  }, []);

  if (!isAuth) {
    return <AuthStack />;
  }

  return <Loader />;
};

export {Wrapper};
