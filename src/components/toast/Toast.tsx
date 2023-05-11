import React, {useEffect, useState} from 'react';
import {Snackbar} from 'react-native-paper';
import {colors} from 'src/styles/colors';
import styles from 'src/components/toast/styles';

export type ToastProps = {
  error: string;
};

const Toast = ({error}: ToastProps) => {
  const [visible, setVisible] = useState(false);
  const onDismissSnackBar = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (error) {
      setVisible(!visible);
    }
  }, [error, visible]);

  return (
    <Snackbar
      action={{
        label: 'Undo',
        onPress: () => {
          setVisible(false);
        },
      }}
      onDismiss={onDismissSnackBar}
      style={styles.container}
      theme={{
        colors: {
          inversePrimary: colors.white,
          inverseOnSurface: colors.white,
        },
      }}
      visible={visible}
      wrapperStyle={{top: 0, zIndex: 100}}>
      {error}
    </Snackbar>
  );
};

export {Toast};
