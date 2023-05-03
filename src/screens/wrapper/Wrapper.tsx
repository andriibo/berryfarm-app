import React, {useEffect} from 'react';
import {AvoidSoftInput} from 'react-native-avoid-softinput';

import {Loader} from '../../components/loader';
import LandingStack from '../../navigation/landing.stack';

const Wrapper = () => {
  const isAuth = false;

  useEffect(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
  }, []);

  if (!isAuth) {
    return <LandingStack />;
  }

  return <Loader />;
};

export {Wrapper};
