import styles from './styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Button, Snackbar, TextInput} from 'react-native-paper';
import {strings} from 'src/locales/locales';
import React, {useCallback, useEffect, useState} from 'react';
import {PostSignInRequest} from 'src/stores/types/PostSignInRequest';
import {Controller, FieldValues, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {validation} from 'src/helpers/verification-rules';
import {login} from 'src/stores/services/FirestoreService';
import {colors} from 'src/styles/colors';
import {AvoidSoftInputView} from 'react-native-avoid-softinput';
import {FirestoreServiceError} from 'src/stores/errors';

const Login = () => {
  const [visible, setVisible] = useState(false);
  const [errorMessage, setError] = useState('');
  const onDismissSnackBar = () => setVisible(false);
  const {
    control,
    handleSubmit,
    formState: {errors, isDirty, isValid},
  } = useForm<PostSignInRequest>({
    defaultValues: {username: ''},
    mode: 'onChange',
    resolver: yupResolver(validation.login),
  });

  useEffect(() => {
    if (errors.username) {
      setError(errors.username.message as string);
      setVisible(!visible);
    }
  }, [errors]);

  const handleLogin = useCallback(
    async ({username}: FieldValues) => {
      try {
        const user = await login(username);

        console.log(user);
      } catch (error: any) {
        if (error instanceof FirestoreServiceError) {
          setError(error.message);
          setVisible(!visible);
        }
      }
    },
    [errorMessage],
  );

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1}}>
      <View style={styles.container}>
        <Snackbar
          action={{
            label: 'Undo',
          }}
          onDismiss={onDismissSnackBar}
          style={{
            backgroundColor: colors.error,
            marginLeft: 20,
            marginRight: 20,
          }}
          theme={{
            colors: {
              inversePrimary: colors.white,
              inverseOnSurface: colors.white,
            },
          }}
          visible={visible}
          wrapperStyle={{top: 0}}>
          {errorMessage}
        </Snackbar>
        <FastImage
          resizeMode="contain"
          source={require('src/assets/images/logo.png')}
          style={styles.image}
        />
        <AvoidSoftInputView avoidOffset={50} style={styles.wrapper}>
          <Controller
            control={control}
            name="username"
            render={({field: {onChange}}) => (
              <TextInput
                label="Email or Username"
                mode="outlined"
                onChangeText={onChange}
                style={{width: '100%'}}
                testID="loginEmail"
              />
            )}
          />
        </AvoidSoftInputView>
        <Button
          disabled={!isDirty || !isValid}
          mode="contained"
          onPress={handleSubmit(handleLogin)}
          style={[styles.btn]}>
          {strings.logIn}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export {Login};
